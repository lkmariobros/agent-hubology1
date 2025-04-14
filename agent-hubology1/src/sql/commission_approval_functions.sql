
-- Get counts for each approval status
CREATE OR REPLACE FUNCTION get_approval_status_counts()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'pending', COALESCE(SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END), 0),
    'under_review', COALESCE(SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END), 0),
    'approved', COALESCE(SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END), 0),
    'ready_for_payment', COALESCE(SUM(CASE WHEN status = 'Ready for Payment' THEN 1 ELSE 0 END), 0),
    'paid', COALESCE(SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END), 0),
    'rejected', COALESCE(SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END), 0)
  ) INTO result
  FROM commission_approvals;
  
  RETURN result;
END;
$$;

-- Get approved commission total
CREATE OR REPLACE FUNCTION get_approved_commission_total()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result json;
  total_amount numeric;
BEGIN
  SELECT COALESCE(SUM(pt.commission_amount), 0)
  INTO total_amount
  FROM commission_approvals ca
  JOIN property_transactions pt ON ca.transaction_id = pt.id
  WHERE ca.status = 'Approved';
  
  SELECT json_build_object('total', total_amount) INTO result;
  RETURN result;
END;
$$;

-- Get pending commission total
CREATE OR REPLACE FUNCTION get_pending_commission_total()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result json;
  total_amount numeric;
BEGIN
  SELECT COALESCE(SUM(pt.commission_amount), 0)
  INTO total_amount
  FROM commission_approvals ca
  JOIN property_transactions pt ON ca.transaction_id = pt.id
  WHERE ca.status = 'Pending';
  
  SELECT json_build_object('total', total_amount) INTO result;
  RETURN result;
END;
$$;

-- Get commission approvals with pagination and filtering
CREATE OR REPLACE FUNCTION get_commission_approvals(
  p_status text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH filtered_approvals AS (
    SELECT
      ca.*,
      pt.transaction_value,
      pt.commission_amount,
      pt.transaction_date,
      pt.property_id,
      pt.commission_rate,
      pt.agent_id,
      pt.notes
    FROM
      commission_approvals ca
    JOIN
      property_transactions pt ON ca.transaction_id = pt.id
    WHERE
      (p_status IS NULL OR ca.status = p_status) AND
      (p_user_id IS NULL OR ca.submitted_by = p_user_id)
    ORDER BY
      ca.created_at DESC
    LIMIT
      p_limit
    OFFSET
      p_offset
  )
  SELECT
    json_build_object(
      'id', fa.id,
      'transaction_id', fa.transaction_id,
      'status', fa.status,
      'submitted_by', fa.submitted_by,
      'reviewed_by', fa.reviewed_by,
      'threshold_exceeded', fa.threshold_exceeded,
      'notes', fa.notes,
      'created_at', fa.created_at,
      'updated_at', fa.updated_at,
      'property_transactions', json_build_object(
        'transaction_value', fa.transaction_value,
        'commission_amount', fa.commission_amount,
        'transaction_date', fa.transaction_date,
        'property_id', fa.property_id,
        'commission_rate', fa.commission_rate,
        'agent_id', fa.agent_id,
        'notes', fa.notes
      )
    )
  FROM
    filtered_approvals fa;
END;
$$;

-- Get a specific commission approval with transaction details
CREATE OR REPLACE FUNCTION get_commission_approval_detail(p_approval_id uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result json;
BEGIN
  SELECT
    json_build_object(
      'id', ca.id,
      'transaction_id', ca.transaction_id,
      'status', ca.status,
      'submitted_by', ca.submitted_by,
      'reviewed_by', ca.reviewed_by,
      'threshold_exceeded', ca.threshold_exceeded,
      'notes', ca.notes,
      'created_at', ca.created_at,
      'updated_at', ca.updated_at,
      'property_transactions', json_build_object(
        'transaction_value', pt.transaction_value,
        'commission_amount', pt.commission_amount,
        'transaction_date', pt.transaction_date,
        'property_id', pt.property_id,
        'commission_rate', pt.commission_rate,
        'agent_id', pt.agent_id,
        'notes', pt.notes
      )
    )
  INTO
    result
  FROM
    commission_approvals ca
  JOIN
    property_transactions pt ON ca.transaction_id = pt.id
  WHERE
    ca.id = p_approval_id;
    
  RETURN result;
END;
$$;

-- Get approval history for a specific approval
CREATE OR REPLACE FUNCTION get_commission_approval_history(p_approval_id uuid)
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    json_build_object(
      'id', id,
      'approval_id', approval_id,
      'previous_status', previous_status,
      'new_status', new_status,
      'changed_by', changed_by,
      'notes', notes,
      'created_at', created_at
    )
  FROM
    commission_approval_history
  WHERE
    approval_id = p_approval_id
  ORDER BY
    created_at DESC;
END;
$$;

-- Get comments for a specific approval
CREATE OR REPLACE FUNCTION get_commission_approval_comments(p_approval_id uuid)
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    json_build_object(
      'id', id,
      'approval_id', approval_id,
      'content', content,
      'created_by', created_by,
      'created_at', created_at
    )
  FROM
    commission_approval_comments
  WHERE
    approval_id = p_approval_id
  ORDER BY
    created_at ASC;
END;
$$;

-- Update approval status and log the change
CREATE OR REPLACE FUNCTION update_commission_approval_status(
  p_approval_id uuid,
  p_new_status text,
  p_notes text DEFAULT NULL
)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_previous_status text;
  result json;
BEGIN
  -- Get current status
  SELECT status INTO v_previous_status 
  FROM commission_approvals 
  WHERE id = p_approval_id;
  
  -- Update status
  UPDATE commission_approvals 
  SET 
    status = p_new_status,
    notes = COALESCE(p_notes, notes),
    reviewed_by = CASE WHEN v_previous_status = 'Pending' THEN auth.uid() ELSE reviewed_by END,
    updated_at = NOW()
  WHERE id = p_approval_id;
  
  -- Log history
  INSERT INTO commission_approval_history (
    approval_id,
    previous_status,
    new_status,
    changed_by,
    notes,
    created_at
  ) VALUES (
    p_approval_id,
    v_previous_status,
    p_new_status,
    auth.uid(),
    p_notes,
    NOW()
  );
  
  SELECT json_build_object(
    'success', true,
    'message', 'Status updated successfully'
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Add comment to approval
CREATE OR REPLACE FUNCTION add_commission_approval_comment(
  p_approval_id uuid,
  p_content text
)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_comment_id uuid;
  result json;
BEGIN
  -- Insert comment
  INSERT INTO commission_approval_comments (
    approval_id,
    content,
    created_by,
    created_at
  ) VALUES (
    p_approval_id,
    p_content,
    auth.uid(),
    NOW()
  ) RETURNING id INTO v_comment_id;
  
  SELECT json_build_object(
    'success', true,
    'comment_id', v_comment_id,
    'message', 'Comment added successfully'
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Delete comment
CREATE OR REPLACE FUNCTION delete_commission_approval_comment(
  p_comment_id uuid
)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_created_by uuid;
  result json;
BEGIN
  -- Check if user is the comment creator
  SELECT created_by INTO v_created_by 
  FROM commission_approval_comments 
  WHERE id = p_comment_id;
  
  IF v_created_by != auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'You can only delete your own comments';
  END IF;
  
  -- Delete comment
  DELETE FROM commission_approval_comments 
  WHERE id = p_comment_id;
  
  SELECT json_build_object(
    'success', true,
    'message', 'Comment deleted successfully'
  ) INTO result;
  
  RETURN result;
END;
$$;
