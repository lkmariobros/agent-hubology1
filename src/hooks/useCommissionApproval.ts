import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Types for approval statuses
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

/**
 * Commission approval interface
 */
export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: ApprovalStatus;
  submitted_by: string;
  reviewer_id: string | null;
  notes: string | null;
  threshold_exceeded: boolean;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

/**
 * Commission approval history interface
 */
export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  notes: string | null;
  created_at: string;
}

/**
 * Commission approval comment interface
 */
export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

/**
 * Commission approval summary stats
 */
interface ApprovalStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  ready_for_payment: number;
  paid: number;
  rejected: number;
  high_value: number;
}

/**
 * Function to fetch all commission approvals with optional filters
 */
export const fetchApprovals = async (
  status?: ApprovalStatus | 'All',
  pendingOnly: boolean = false,
  highValueOnly: boolean = false,
  page: number = 0,
  pageSize: number = 10
) => {
  try {
    let query = supabase
      .from('commission_approvals')
      .select(`
        *,
        transaction:transaction_id(
          *,
          property:property_id(title, id),
          agent:agent_id(id, full_name)
        ),
        submitted_by_profile:submitted_by(
          full_name
        ),
        reviewer:reviewer_id(
          full_name
        )
      `);

    // Filter by status if specified and not 'All'
    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    // Filter for pending approvals (any status that is not 'Paid')
    if (pendingOnly) {
      query = query.not('status', 'eq', 'Paid');
    }

    // Filter for high value approvals
    if (highValueOnly) {
      query = query.eq('threshold_exceeded', true);
    }

    // Add pagination
    query = query
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      approvals: data || [],
      totalCount: count || 0
    };
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return { approvals: [], totalCount: 0 };
  }
};

/**
 * Function to fetch approval statistics
 */
export const fetchApprovalStatusCounts = async (): Promise<Record<string, number>> => {
  try {
    // Get total counts by status
    const { data, error } = await supabase.rpc('get_approval_status_counts');

    if (error) throw error;

    return data || {
      pending: 0,
      under_review: 0,
      approved: 0,
      ready_for_payment: 0,
      paid: 0,
      rejected: 0
    };
  } catch (error) {
    console.error('Error fetching approval status counts:', error);
    return {
      pending: 0,
      under_review: 0,
      approved: 0,
      ready_for_payment: 0,
      paid: 0,
      rejected: 0
    };
  }
};

/**
 * Function to fetch pending commission total
 */
export const fetchPendingCommissionTotal = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.functions.invoke('get_pending_commission_total');

    if (error) throw error;

    return data?.total || 0;
  } catch (error) {
    console.error('Error fetching pending commission total:', error);
    return 0;
  }
};

/**
 * Function to fetch approved commission total
 */
export const fetchApprovedCommissionTotal = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.functions.invoke('get_approved_commission_total');

    if (error) throw error;

    return data?.total || 0;
  } catch (error) {
    console.error('Error fetching approved commission total:', error);
    return 0;
  }
};

/**
 * Function to fetch a single approval by ID
 */
export const fetchApprovalById = async (approvalId: string) => {
  try {
    const { data, error } = await supabase
      .from('commission_approvals')
      .select(`
        *,
        property_transactions!transaction_id(
          transaction_value,
          commission_amount,
          transaction_date,
          property_id,
          commission_rate,
          agent_id,
          notes
        )
      `)
      .eq('id', approvalId)
      .single();

    if (error) throw error;

    // Fetch approval history
    const { data: historyData, error: historyError } = await supabase
      .from('approval_history')
      .select('*')
      .eq('approval_id', approvalId)
      .order('created_at', { ascending: false });

    if (historyError) throw historyError;

    // Fetch approval comments
    const { data: commentsData, error: commentsError } = await supabase
      .from('approval_comments')
      .select('*')
      .eq('approval_id', approvalId)
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;

    return {
      approval: data,
      history: historyData || [],
      comments: commentsData || []
    };
  } catch (error) {
    console.error('Error fetching approval by ID:', error);
    throw error;
  }
};

/**
 * Function to fetch approval history
 */
export const fetchApprovalHistory = async (approvalId: string): Promise<CommissionApprovalHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('approval_history')
      .select(`
        *,
        user:changed_by(
          full_name, email
        )
      `)
      .eq('approval_id', approvalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching approval history:', error);
    return [];
  }
};

/**
 * Function to fetch approval comments
 */
export const fetchApprovalComments = async (approvalId: string): Promise<CommissionApprovalComment[]> => {
  try {
    const { data, error } = await supabase
      .from('approval_comments')
      .select(`
        *,
        user:created_by(
          full_name, email, avatar_url
        )
      `)
      .eq('approval_id', approvalId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching approval comments:', error);
    return [];
  }
};

/**
 * Function to add a comment to an approval
 */
export const addApprovalComment = async ({ approvalId, content }: { approvalId: string; content: string }) => {
  try {
    const { data, error } = await supabase
      .from('approval_comments')
      .insert({
        approval_id: approvalId,
        content: content,
        created_by: supabase.auth.getUser().then(data => data.data.user?.id || '')
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding approval comment:', error);
    throw error;
  }
};

/**
 * Function to delete a comment
 */
export const deleteApprovalComment = async ({ commentId, approvalId }: { commentId: string; approvalId: string }) => {
  try {
    const { error } = await supabase
      .from('approval_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting approval comment:', error);
    throw error;
  }
};

/**
 * Function to update approval status
 */
export const updateApprovalStatus = async ({
  approvalId,
  status,
  notes
}: {
  approvalId: string;
  status: string;
  notes?: string;
}) => {
  try {
    // We use an RPC call to a custom function that handles status updates
    const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
      body: {
        p_approval_id: approvalId,
        p_new_status: status,
        p_notes: notes
      }
    });

    if (error) throw error;
    return data || { success: true };
  } catch (error) {
    console.error('Error updating approval status:', error);
    throw error;
  }
};

/**
 * Function to fetch system configuration
 */
export const fetchSystemConfiguration = async () => {
  try {
    const { data, error } = await supabase
      .from('system_configuration')
      .select('key, value')
      .in('key', ['commission_threshold_amount', 'commission_approval_required']);

    if (error) throw error;

    const configMap: Record<string, string> = {};
    data?.forEach(item => {
      configMap[item.key] = item.value;
    });

    return {
      thresholdAmount: Number(configMap.commission_threshold_amount) || 10000,
      approvalRequired: configMap.commission_approval_required === 'true'
    };
  } catch (error) {
    console.error('Error fetching system configuration:', error);
    return {
      thresholdAmount: 10000, // Default threshold
      approvalRequired: true  // Default to require approval
    };
  }
};

/**
 * Function to check if commission amount exceeds threshold
 */
export const checkCommissionApproval = async (commissionAmount: number) => {
  try {
    const config = await fetchSystemConfiguration();
    
    return {
      threshold: config.thresholdAmount,
      exceedsThreshold: commissionAmount > config.thresholdAmount,
      approvalRequired: config.approvalRequired
    };
  } catch (error) {
    console.error('Error checking commission approval:', error);
    return {
      threshold: 10000,
      exceedsThreshold: false,
      approvalRequired: true
    };
  }
};

// === HOOK DEFINITIONS ===

/**
 * Hook for fetching approval status counts
 */
export function useApprovalStatusCounts() {
  return useQuery({
    queryKey: ['approvalStatusCounts'],
    queryFn: fetchApprovalStatusCounts
  });
}

/**
 * Hook for fetching pending commission total
 */
export function usePendingCommissionTotal() {
  return useQuery({
    queryKey: ['pendingCommissionTotal'],
    queryFn: fetchPendingCommissionTotal
  });
}

/**
 * Hook for fetching approved commission total
 */
export function useApprovedCommissionTotal() {
  return useQuery({
    queryKey: ['approvedCommissionTotal'],
    queryFn: fetchApprovedCommissionTotal
  });
}

/**
 * Hook for fetching commission approvals
 */
export function useCommissionApprovals(
  status?: ApprovalStatus | 'All',
  isAdmin: boolean = false,
  userId?: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ['commissionApprovals', status, isAdmin, userId, page, pageSize],
    queryFn: () => fetchApprovals(status, false, false, page - 1, pageSize)
  });
}

/**
 * Hook for fetching a single commission approval detail
 */
export function useCommissionApprovalDetail(approvalId: string) {
  return useQuery({
    queryKey: ['commissionApproval', approvalId],
    queryFn: () => fetchApprovalById(approvalId),
    enabled: !!approvalId
  });
}

/**
 * Hook for updating approval status
 */
export function useUpdateApprovalStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateApprovalStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commissionApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['approvalStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCommissionTotal'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCommissionTotal'] });
    }
  });
}

/**
 * Hook for adding a comment
 */
export function useAddApprovalComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addApprovalComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
    }
  });
}

/**
 * Hook for deleting a comment
 */
export function useDeleteApprovalComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteApprovalComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
    }
  });
}

/**
 * Hook for checking commission approval requirements
 */
export function useCommissionApprovalCheck(commissionAmount: number) {
  return useQuery({
    queryKey: ['commissionApprovalCheck', commissionAmount],
    queryFn: () => checkCommissionApproval(commissionAmount),
    enabled: commissionAmount > 0
  });
}

/**
 * Hook for system configuration
 */
export function useSystemConfiguration() {
  return useQuery({
    queryKey: ['systemConfiguration'],
    queryFn: fetchSystemConfiguration
  });
}
