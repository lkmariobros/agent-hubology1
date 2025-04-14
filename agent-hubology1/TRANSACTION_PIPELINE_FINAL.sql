-- =============================================
-- TRANSACTION PIPELINE SETUP SCRIPT (FINAL VERSION)
-- =============================================
-- This script sets up all the necessary tables, functions, and RLS policies
-- for the transaction pipeline from agent portal to admin portal.
-- With fixed type casting for UUID and TEXT comparisons

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Create a function to convert text to UUID safely
CREATE OR REPLACE FUNCTION public.text_to_uuid(text_id TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  BEGIN
    RETURN text_id::UUID;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END;
$$;

-- Create a function to check if the current user matches a text ID
CREATE OR REPLACE FUNCTION public.is_current_user(user_text_id TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_text_id = auth.uid();
END;
$$;

-- Create a function to check if a user owns a transaction
CREATE OR REPLACE FUNCTION public.user_owns_transaction(transaction_agent_id UUID, transaction_clerk_id TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user is the agent or clerk
  RETURN (transaction_agent_id = text_to_uuid(current_user_id) OR transaction_clerk_id = current_user_id);
END;
$$;

-- Create the is_admin_tier() function
CREATE OR REPLACE FUNCTION public.is_admin_tier()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id text;
  _user_role text;
  _is_admin boolean;
BEGIN
  -- Get the user ID from the JWT token
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if the user has an admin role in the profiles table
  -- First, try to get the role from the agent_profiles table if it exists
  BEGIN
    SELECT 
      CASE 
        WHEN role = 'admin' OR role = 'Admin' OR role = 'ADMIN' THEN true
        ELSE false
      END INTO _is_admin
    FROM agent_profiles
    WHERE id = text_to_uuid(_user_id);
    
    -- If we found a result, return it
    IF _is_admin IS NOT NULL THEN
      RETURN _is_admin;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- Table might not exist, continue to next check
      NULL;
  END;
  
  -- If we didn't find a result in agent_profiles, try the profiles table
  BEGIN
    SELECT 
      CASE 
        WHEN role = 'admin' OR role = 'Admin' OR role = 'ADMIN' THEN true
        ELSE false
      END INTO _is_admin
    FROM profiles
    WHERE id = text_to_uuid(_user_id);
    
    -- If we found a result, return it
    IF _is_admin IS NOT NULL THEN
      RETURN _is_admin;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- Table might not exist, continue to next check
      NULL;
  END;
  
  -- If we still don't have a result, check if the user is a service role
  -- This is a fallback for development/testing
  IF auth.role() = 'service_role' THEN
    RETURN true;
  END IF;
  
  -- Default to false if we couldn't determine admin status
  RETURN false;
END;
$$;

-- Create a simpler is_admin() function as an alias
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN is_admin_tier();
END;
$$;

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION public.text_to_uuid(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_transaction(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_tier() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =============================================
-- COMMISSION PAYMENT SCHEDULES
-- =============================================

-- Create commission_payment_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create schedule_installments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.schedule_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.commission_payment_schedules(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  days_after_transaction INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the tables
ALTER TABLE public.commission_payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_installments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for commission_payment_schedules
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_payment_schedules' AND policyname = 'Everyone can view payment schedules'
  ) THEN
    CREATE POLICY "Everyone can view payment schedules" 
    ON public.commission_payment_schedules FOR SELECT 
    TO authenticated
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_payment_schedules' AND policyname = 'Admins can manage payment schedules'
  ) THEN
    CREATE POLICY "Admins can manage payment schedules" 
    ON public.commission_payment_schedules FOR ALL 
    TO authenticated
    USING (is_admin_tier());
  END IF;
END $$;

-- Create RLS policies for schedule_installments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'schedule_installments' AND policyname = 'Everyone can view schedule installments'
  ) THEN
    CREATE POLICY "Everyone can view schedule installments" 
    ON public.schedule_installments FOR SELECT 
    TO authenticated
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'schedule_installments' AND policyname = 'Admins can manage schedule installments'
  ) THEN
    CREATE POLICY "Admins can manage schedule installments" 
    ON public.schedule_installments FOR ALL 
    TO authenticated
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON public.commission_payment_schedules TO authenticated;
GRANT SELECT ON public.schedule_installments TO authenticated;

-- Insert default payment schedules if none exist
INSERT INTO public.commission_payment_schedules (name, description, is_default)
SELECT 'Standard', 'Standard payment schedule with 3 installments', true
WHERE NOT EXISTS (SELECT 1 FROM public.commission_payment_schedules);

-- Get the ID of the default schedule
DO $$
DECLARE
  default_schedule_id UUID;
BEGIN
  SELECT id INTO default_schedule_id FROM public.commission_payment_schedules WHERE is_default = true LIMIT 1;
  
  -- Insert default installments if none exist
  IF NOT EXISTS (SELECT 1 FROM public.schedule_installments WHERE schedule_id = default_schedule_id) THEN
    INSERT INTO public.schedule_installments (schedule_id, installment_number, percentage, days_after_transaction, description)
    VALUES
      (default_schedule_id, 1, 30, 0, 'Initial payment'),
      (default_schedule_id, 2, 40, 30, '30-day payment'),
      (default_schedule_id, 3, 30, 60, 'Final payment');
  END IF;
END $$;

-- =============================================
-- PROPERTY TRANSACTIONS
-- =============================================

-- Create property_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.property_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type_id UUID,
  property_id UUID,
  transaction_date DATE NOT NULL,
  closing_date DATE,
  transaction_value DECIMAL(12, 2),
  commission_rate DECIMAL(5, 2),
  commission_amount DECIMAL(12, 2),
  commission_split BOOLEAN DEFAULT false,
  co_agent_id UUID,
  co_agent_commission_percentage DECIMAL(5, 2),
  agent_id UUID,
  clerk_id TEXT,
  status TEXT DEFAULT 'Pending',
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  seller_name TEXT,
  seller_email TEXT,
  seller_phone TEXT,
  notes TEXT,
  payment_schedule_id UUID REFERENCES public.commission_payment_schedules(id),
  installments_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the property_transactions table
ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for property_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_transactions' AND policyname = 'Agents can view their own transactions'
  ) THEN
    CREATE POLICY "Agents can view their own transactions" 
    ON public.property_transactions FOR SELECT 
    USING (user_owns_transaction(agent_id, clerk_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_transactions' AND policyname = 'Admins can view all transactions'
  ) THEN
    CREATE POLICY "Admins can view all transactions" 
    ON public.property_transactions FOR SELECT 
    USING (is_admin_tier());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_transactions' AND policyname = 'Agents can insert their own transactions'
  ) THEN
    CREATE POLICY "Agents can insert their own transactions" 
    ON public.property_transactions FOR INSERT 
    WITH CHECK (user_owns_transaction(agent_id, clerk_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_transactions' AND policyname = 'Agents can update their own transactions'
  ) THEN
    CREATE POLICY "Agents can update their own transactions" 
    ON public.property_transactions FOR UPDATE 
    USING (user_owns_transaction(agent_id, clerk_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'property_transactions' AND policyname = 'Admins can manage all transactions'
  ) THEN
    CREATE POLICY "Admins can manage all transactions" 
    ON public.property_transactions FOR ALL 
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.property_transactions TO authenticated;

-- =============================================
-- COMMISSIONS
-- =============================================

-- Create commissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  agent_id UUID,
  clerk_id TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  payment_schedule_id UUID REFERENCES public.commission_payment_schedules(id),
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the commissions table
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user owns a commission
CREATE OR REPLACE FUNCTION public.user_owns_commission(commission_agent_id UUID, commission_clerk_id TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user is the agent or clerk
  RETURN (commission_agent_id = text_to_uuid(current_user_id) OR commission_clerk_id = current_user_id);
END;
$$;

-- Create RLS policies for commissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commissions' AND policyname = 'Users can view their own commissions'
  ) THEN
    CREATE POLICY "Users can view their own commissions" 
    ON public.commissions FOR SELECT 
    USING (user_owns_commission(agent_id, clerk_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commissions' AND policyname = 'Users can insert their own commissions'
  ) THEN
    CREATE POLICY "Users can insert their own commissions" 
    ON public.commissions FOR INSERT 
    WITH CHECK (user_owns_commission(agent_id, clerk_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commissions' AND policyname = 'Admins can manage all commissions'
  ) THEN
    CREATE POLICY "Admins can manage all commissions" 
    ON public.commissions FOR ALL 
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.commissions TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_commission(UUID, TEXT) TO authenticated;

-- =============================================
-- COMMISSION INSTALLMENTS
-- =============================================

-- Create commission_installments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  agent_id UUID,
  amount DECIMAL(12, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  actual_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the commission_installments table
ALTER TABLE public.commission_installments ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user owns an installment
CREATE OR REPLACE FUNCTION public.user_owns_installment(installment_agent_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user is the agent
  RETURN (installment_agent_id = text_to_uuid(current_user_id));
END;
$$;

-- Create RLS policies for commission_installments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_installments' AND policyname = 'Users can view their own installments'
  ) THEN
    CREATE POLICY "Users can view their own installments" 
    ON public.commission_installments FOR SELECT 
    USING (user_owns_installment(agent_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_installments' AND policyname = 'Admins can manage all installments'
  ) THEN
    CREATE POLICY "Admins can manage all installments" 
    ON public.commission_installments FOR ALL 
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON public.commission_installments TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_installment(UUID) TO authenticated;

-- =============================================
-- TRANSACTION DOCUMENTS
-- =============================================

-- Create transaction_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transaction_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the transaction_documents table
ALTER TABLE public.transaction_documents ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user can access a document
CREATE OR REPLACE FUNCTION public.user_can_access_document(doc_uploaded_by TEXT, doc_transaction_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
  transaction_exists BOOLEAN;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user uploaded the document
  IF doc_uploaded_by = current_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if the user owns the transaction
  SELECT EXISTS (
    SELECT 1 FROM property_transactions 
    WHERE id = doc_transaction_id AND user_owns_transaction(agent_id, clerk_id)
  ) INTO transaction_exists;
  
  RETURN transaction_exists;
END;
$$;

-- Create RLS policies for transaction_documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transaction_documents' AND policyname = 'Users can view their own documents'
  ) THEN
    CREATE POLICY "Users can view their own documents" 
    ON public.transaction_documents FOR SELECT 
    USING (user_can_access_document(uploaded_by, transaction_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transaction_documents' AND policyname = 'Users can insert their own documents'
  ) THEN
    CREATE POLICY "Users can insert their own documents" 
    ON public.transaction_documents FOR INSERT 
    WITH CHECK (is_current_user(uploaded_by));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transaction_documents' AND policyname = 'Admins can manage all documents'
  ) THEN
    CREATE POLICY "Admins can manage all documents" 
    ON public.transaction_documents FOR ALL 
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.transaction_documents TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_access_document(TEXT, UUID) TO authenticated;

-- =============================================
-- COMMISSION APPROVALS
-- =============================================

-- Create commission_approvals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending',
  submitted_by TEXT,
  reviewer_id TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  threshold_exceeded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the commission_approvals table
ALTER TABLE public.commission_approvals ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user can access an approval
CREATE OR REPLACE FUNCTION public.user_can_access_approval(approval_submitted_by TEXT, approval_transaction_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
  transaction_exists BOOLEAN;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user submitted the approval
  IF approval_submitted_by = current_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if the user owns the transaction
  SELECT EXISTS (
    SELECT 1 FROM property_transactions 
    WHERE id = approval_transaction_id AND user_owns_transaction(agent_id, clerk_id)
  ) INTO transaction_exists;
  
  RETURN transaction_exists;
END;
$$;

-- Create RLS policies for commission_approvals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_approvals' AND policyname = 'Users can view their own approvals'
  ) THEN
    CREATE POLICY "Users can view their own approvals" 
    ON public.commission_approvals FOR SELECT 
    USING (user_can_access_approval(submitted_by, transaction_id));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_approvals' AND policyname = 'Admins can manage all approvals'
  ) THEN
    CREATE POLICY "Admins can manage all approvals" 
    ON public.commission_approvals FOR ALL 
    USING (is_admin_tier());
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON public.commission_approvals TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_access_approval(TEXT, UUID) TO authenticated;

-- =============================================
-- HELPER FUNCTIONS FOR FRONTEND INTEGRATION
-- =============================================

-- Function to convert auth.uid() to UUID for frontend use
CREATE OR REPLACE FUNCTION public.current_user_id_as_uuid()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN text_to_uuid(auth.uid());
END;
$$;

-- Function to get transactions for the current user
CREATE OR REPLACE FUNCTION public.get_user_transactions()
RETURNS SETOF property_transactions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  current_user_id := auth.uid();
  
  RETURN QUERY
  SELECT * FROM property_transactions
  WHERE user_owns_transaction(agent_id, clerk_id)
  ORDER BY created_at DESC;
END;
$$;

-- Function to get commissions for the current user
CREATE OR REPLACE FUNCTION public.get_user_commissions()
RETURNS SETOF commissions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  current_user_id := auth.uid();
  
  RETURN QUERY
  SELECT * FROM commissions
  WHERE user_owns_commission(agent_id, clerk_id)
  ORDER BY created_at DESC;
END;
$$;

-- Grant execute permission on the helper functions
GRANT EXECUTE ON FUNCTION public.current_user_id_as_uuid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_transactions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_commissions() TO authenticated;

-- =============================================
-- ENABLE REALTIME
-- =============================================

-- Enable realtime for all tables
BEGIN;
  -- Check if the publication exists
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END;
  $$;

  -- Add tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.property_transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.commissions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_installments;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transaction_documents;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_approvals;
COMMIT;

-- =============================================
-- FINAL MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Transaction pipeline setup complete with UUID for agent_id!';
END $$;
