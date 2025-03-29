
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Types for approval statuses
type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

/**
 * Commission approval interface
 */
interface CommissionApproval {
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

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return [];
  }
};

/**
 * Function to fetch approval statistics
 */
export const fetchApprovalStats = async (): Promise<ApprovalStats> => {
  try {
    // Get total counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('commission_approvals')
      .select('status', { count: 'exact', head: false })
      .then((res) => {
        const counts: Record<string, number> = {
          pending: 0,
          under_review: 0,
          approved: 0,
          ready_for_payment: 0,
          paid: 0,
          rejected: 0,
          high_value: 0,
        };
        
        if (res.data) {
          res.data.forEach((item: any) => {
            const status = item.status.toLowerCase().replace(' ', '_');
            if (counts.hasOwnProperty(status)) {
              counts[status]++;
            }
          });
        }
        
        return { data: counts, error: res.error };
      });

    if (statusError) throw statusError;

    // Count high value approvals
    const { count: highValueCount, error: highValueError } = await supabase
      .from('commission_approvals')
      .select('*', { count: 'exact', head: true })
      .eq('threshold_exceeded', true);

    if (highValueError) throw highValueError;

    // Count total approvals
    const { count: totalCount, error: totalError } = await supabase
      .from('commission_approvals')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    return {
      total: totalCount || 0,
      pending: statusCounts?.pending || 0,
      under_review: statusCounts?.under_review || 0,
      approved: statusCounts?.approved || 0,
      ready_for_payment: statusCounts?.ready_for_payment || 0,
      paid: statusCounts?.paid || 0,
      rejected: statusCounts?.rejected || 0,
      high_value: highValueCount || 0,
    };
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    return {
      total: 0,
      pending: 0,
      under_review: 0,
      approved: 0,
      ready_for_payment: 0,
      paid: 0,
      rejected: 0,
      high_value: 0,
    };
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
        transaction:transaction_id(
          *,
          property:property_id(title, id, property_type_id, transaction_type_id),
          agent:agent_id(id, full_name, email, tier, tier_name, commission_percentage)
        ),
        submitted_by_profile:submitted_by(
          full_name, email
        ),
        reviewer:reviewer_id(
          full_name, email
        )
      `)
      .eq('id', approvalId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching approval by ID:', error);
    return null;
  }
};

/**
 * Function to fetch approval history
 */
export const fetchApprovalHistory = async (approvalId: string) => {
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
export const fetchApprovalComments = async (approvalId: string) => {
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
export const addApprovalComment = async (approvalId: string, comment: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('approval_comments')
      .insert({
        approval_id: approvalId,
        comment_text: comment,
        created_by: userId
      })
      .select(`
        *,
        user:created_by(
          full_name, email, avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding approval comment:', error);
    throw error;
  }
};

/**
 * Function to update approval status
 */
export const updateApprovalStatus = async (
  approvalId: string,
  newStatus: ApprovalStatus,
  notes?: string
) => {
  try {
    // We use an RPC call to a custom function that handles status updates
    const { data, error } = await supabase.rpc(
      'update_commission_approval_status',
      {
        p_approval_id: approvalId,
        p_new_status: newStatus,
        p_notes: notes
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating approval status:', error);
    throw error;
  }
};

/**
 * Hook for fetching commission approvals with filters
 */
export const useApprovalsQuery = (
  status?: ApprovalStatus | 'All',
  pendingOnly = false,
  highValueOnly = false,
  page = 0,
  pageSize = 10
) => {
  return useQuery({
    queryKey: ['approvals', status, pendingOnly, highValueOnly, page, pageSize],
    queryFn: () => fetchApprovals(status, pendingOnly, highValueOnly, page, pageSize)
  });
};

/**
 * Hook for fetching approval statistics
 */
export const useApprovalStatsQuery = () => {
  return useQuery({
    queryKey: ['approvalStats'],
    queryFn: fetchApprovalStats
  });
};

/**
 * Hook for fetching a single approval by ID
 */
export const useApprovalByIdQuery = (approvalId: string) => {
  return useQuery({
    queryKey: ['approval', approvalId],
    queryFn: () => fetchApprovalById(approvalId),
    enabled: !!approvalId
  });
};

/**
 * Hook for fetching approval history
 */
export const useApprovalHistoryQuery = (approvalId: string) => {
  return useQuery({
    queryKey: ['approvalHistory', approvalId],
    queryFn: () => fetchApprovalHistory(approvalId),
    enabled: !!approvalId
  });
};

/**
 * Hook for fetching approval comments
 */
export const useApprovalCommentsQuery = (approvalId: string) => {
  return useQuery({
    queryKey: ['approvalComments', approvalId],
    queryFn: () => fetchApprovalComments(approvalId),
    enabled: !!approvalId
  });
};

/**
 * Hook for adding a comment to an approval
 */
export const useAddApprovalCommentMutation = (approvalId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (comment: string) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      return addApprovalComment(approvalId, comment, user.id);
    },
    onSuccess: () => {
      toast.success('Comment added successfully');
      queryClient.invalidateQueries({ queryKey: ['approvalComments', approvalId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    }
  });
};

/**
 * Hook for updating approval status
 */
export const useUpdateApprovalStatusMutation = (approvalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newStatus, notes }: { newStatus: ApprovalStatus; notes?: string }) => {
      return updateApprovalStatus(approvalId, newStatus, notes);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Status updated successfully`);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['approval', approvalId] });
        queryClient.invalidateQueries({ queryKey: ['approvalHistory', approvalId] });
        queryClient.invalidateQueries({ queryKey: ['approvals'] });
        queryClient.invalidateQueries({ queryKey: ['approvalStats'] });
      } else {
        toast.error(`Failed to update status: ${data.message}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};

/**
 * Function to fetch high value commission metrics
 */
export const fetchHighValueCommissionMetrics = async () => {
  try {
    // Get average commission amount for high value approvals
    const { data: avgData, error: avgError } = await supabase
      .from('commission_approvals')
      .select(`
        transaction:transaction_id(
          commission_amount
        )
      `)
      .eq('threshold_exceeded', true);

    if (avgError) throw avgError;

    if (!avgData || avgData.length === 0) {
      return {
        averageCommission: 0,
        totalHighValue: 0,
        percentageApproved: 0
      };
    }

    // Calculate average commission amount
    const commissionValues = avgData.map(item => item.transaction.commission_amount);
    const totalCommission = commissionValues.reduce((sum, amount) => sum + amount, 0);
    const averageCommission = totalCommission / commissionValues.length;

    // Get count of high value approvals
    const { count: totalHighValue, error: countError } = await supabase
      .from('commission_approvals')
      .select('*', { count: 'exact', head: true })
      .eq('threshold_exceeded', true);

    if (countError) throw countError;

    // Get count of approved high value approvals
    const { count: approvedHighValue, error: approvedError } = await supabase
      .from('commission_approvals')
      .select('*', { count: 'exact', head: true })
      .eq('threshold_exceeded', true)
      .in('status', ['Approved', 'Ready for Payment', 'Paid']);

    if (approvedError) throw approvedError;

    // Calculate percentage approved
    const percentageApproved = totalHighValue ? (approvedHighValue / totalHighValue) * 100 : 0;

    return {
      averageCommission,
      totalHighValue,
      percentageApproved
    };
  } catch (error) {
    console.error('Error fetching high value commission metrics:', error);
    return {
      averageCommission: 0,
      totalHighValue: 0,
      percentageApproved: 0
    };
  }
};

/**
 * Hook for fetching high value commission metrics
 */
export const useHighValueCommissionMetricsQuery = () => {
  return useQuery({
    queryKey: ['highValueCommissionMetrics'],
    queryFn: fetchHighValueCommissionMetrics
  });
};
