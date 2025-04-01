import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ApprovalHistoryItem {
  id: string;
  approval_id: string;
  old_status: string;
  new_status: string;
  changed_by: string;
  changed_by_name?: string;
  created_at: string;
  notes?: string;
  previous_status: string; // Add this field
}

export interface ApprovalComment {
  id: string;
  approval_id: string;
  comment_text: string;
  created_by: string; // Add this field
  created_by_name?: string; // Add this field
  created_at: string;
  comment: string; // Add this alias field for backward compatibility
  user_id?: string; // Add this field
  user_name?: string; // Add this field
}

export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: string;
  submitted_by: string;
  reviewer_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  threshold_exceeded: boolean;
}

export interface ApprovalCountResult {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  rejected: number;
}

const useCommissionApproval = () => {
  const queryClient = useQueryClient();

  // Get approval status counts
  const useApprovalStatusCounts = () => {
    return useQuery({
      queryKey: ['approval-status-counts'],
      queryFn: async () => {
        try {
          // Get counts for each status
          const statusCounts: ApprovalCountResult = {
            pending: 0,
            underReview: 0,
            approved: 0,
            readyForPayment: 0,
            paid: 0,
            rejected: 0
          };
          
          // Fetch all statuses in one go - fix the groupBy issue
          const { data, error } = await supabase
            .from('commission_approvals')
            .select('status, count')
            .select('status');
          
          if (error) throw error;
          
          // Get counts individually since groupBy isn't available
          const pendingCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Pending');
          const underReviewCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Under Review');
          const approvedCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Approved');
          const readyForPaymentCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Ready for Payment');
          const paidCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Paid');
          const rejectedCount = await supabase.from('commission_approvals').select('*', { count: 'exact' }).eq('status', 'Rejected');
          
          statusCounts.pending = pendingCount.count || 0;
          statusCounts.underReview = underReviewCount.count || 0;
          statusCounts.approved = approvedCount.count || 0;
          statusCounts.readyForPayment = readyForPaymentCount.count || 0;
          statusCounts.paid = paidCount.count || 0;
          statusCounts.rejected = rejectedCount.count || 0;
          
          return statusCounts;
        } catch (error) {
          console.error('Error fetching approval status counts:', error);
          toast.error('Failed to load approval status counts');
          throw error;
        }
      }
    });
  };
  
  // Get a list of commission approvals with filtering
  const useCommissionApprovals = (status?: string, includeCount = false, sort = 'created_at', page = 1, pageSize = 10) => {
    return useQuery({
      queryKey: ['commission-approvals', { status, sort, page, pageSize }],
      queryFn: async () => {
        try {
          // Build the query
          let query = supabase.from('commission_approvals')
            .select('*')
            .order(sort, { ascending: false });
        
          if (status && status !== 'All') {
            query = query.eq('status', status);
          }
        
          // Add pagination
          query = query.range((page - 1) * pageSize, (page * pageSize) - 1);
        
          const { data, error } = await query;
        
          if (error) throw error;
        
          // Get total count in a separate query if needed
          let count = 0;
          if (includeCount) {
            const countQuery = supabase.from('commission_approvals').select('*', { count: 'exact' });
            if (status && status !== 'All') {
              countQuery.eq('status', status);
            }
            const { count: totalCount, error: countError } = await countQuery;
            if (countError) throw countError;
            count = totalCount || 0;
          }
        
          return includeCount ? { approvals: data || [], totalCount: count } : data || [];
        } catch (error) {
          console.error('Error fetching commission approvals:', error);
          toast.error('Failed to load commission approvals');
          throw error;
        }
      }
    });
  };
  
  // Get a single commission approval detail
  const useCommissionApprovalDetail = (id?: string) => {
    return useQuery({
      queryKey: ['commission-approval', id],
      queryFn: async () => {
        if (!id) return null;
        
        try {
          const { data, error } = await supabase
            .from('commission_approvals')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          return data;
        } catch (error) {
          console.error('Error fetching commission approval detail:', error);
          toast.error('Failed to load commission approval details');
          throw error;
        }
      },
      enabled: !!id
    });
  };
  
  // Get history for a specific approval
  const useCommissionApprovalHistory = (approvalId?: string) => {
    return useQuery({
      queryKey: ['commission-approval-history', approvalId],
      queryFn: async () => {
        if (!approvalId) return [];
        
        try {
          const { data, error } = await supabase
            .from('approval_history')
            .select('*')
            .eq('approval_id', approvalId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          return data as ApprovalHistoryItem[];
        } catch (error) {
          console.error('Error fetching commission approval history:', error);
          toast.error('Failed to load approval history');
          throw error;
        }
      },
      enabled: !!approvalId
    });
  };

  
  
  // Get total pending commission amount
  const usePendingCommissionTotal = () => {
    return useQuery({
      queryKey: ['pending-commission-total'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase.rpc('get_pending_commission_total');
          
          if (error) throw error;
          
          return data || 0;
        } catch (error) {
          console.error('Error fetching pending commission total:', error);
          toast.error('Failed to load pending commission total');
          return 0;
        }
      }
    });
  };
  
  // Get total approved commission amount
  const useApprovedCommissionTotal = () => {
    return useQuery({
      queryKey: ['approved-commission-total'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase.rpc('get_approved_commission_total');
          
          if (error) throw error;
          
          return data || 0;
        } catch (error) {
          console.error('Error fetching approved commission total:', error);
          toast.error('Failed to load approved commission total');
          return 0;
        }
      }
    });
  };
  
  // Get comments for a specific approval
  const useApprovalComments = (approvalId?: string) => {
    return useQuery({
      queryKey: ['approval-comments', approvalId],
      queryFn: async () => {
        if (!approvalId) return [];
        
        try {
          const { data, error } = await supabase
            .from('approval_comments')
            .select('*')
            .eq('approval_id', approvalId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Map data to include comment alias for backward compatibility
          return (data || []).map(comment => ({
            ...comment,
            comment: comment.comment_text,
            user_name: comment.created_by_name || 'Unknown User',
            user_id: comment.created_by
          })) as ApprovalComment[];
        } catch (error) {
          console.error('Error fetching approval comments:', error);
          toast.error('Failed to load comments');
          throw error;
        }
      },
      enabled: !!approvalId
    });
  };
  
  // Add a comment to an approval
  const useAddApprovalCommentMutation = () => {
    return useMutation({
      mutationFn: async ({ approvalId, comment }: { approvalId: string, comment: string }) => {
        try {
          const { data, error } = await supabase
            .from('approval_comments')
            .insert({
              approval_id: approvalId,
              comment_text: comment,
              created_by: (await supabase.auth.getUser()).data.user?.id
            })
            .select()
            .single();
          
          if (error) throw error;
          
          return data;
        } catch (error) {
          console.error('Error adding approval comment:', error);
          throw error;
        }
      },
      onSuccess: (_, { approvalId }) => {
        queryClient.invalidateQueries({ queryKey: ['approval-comments', approvalId] });
      }
    });
  };
  
  // Delete a comment from an approval
  const useDeleteApprovalCommentMutation = () => {
    return useMutation({
      mutationFn: async ({ commentId, approvalId }: { commentId: string, approvalId: string }) => {
        try {
          const { error } = await supabase
            .from('approval_comments')
            .delete()
            .eq('id', commentId);
          
          if (error) throw error;
          
          return true;
        } catch (error) {
          console.error('Error deleting approval comment:', error);
          throw error;
        }
      },
      onSuccess: (_, { approvalId }) => {
        queryClient.invalidateQueries({ queryKey: ['approval-comments', approvalId] });
      }
    });
  };
  
  // Update approval status
  const useUpdateApprovalStatusMutation = () => {
    return useMutation({
      mutationFn: async ({ 
        approvalId, 
        newStatus, 
        notes 
      }: { 
        approvalId: string, 
        newStatus: string, 
        notes?: string 
      }) => {
        try {
          // First get the current status
          const { data: currentData, error: fetchError } = await supabase
            .from('commission_approvals')
            .select('status')
            .eq('id', approvalId)
            .single();
          
          if (fetchError) throw fetchError;
          
          // Update the status
          const { data, error } = await supabase
            .from('commission_approvals')
            .update({
              status: newStatus,
              notes: notes,
              updated_at: new Date().toISOString(),
              reviewed_at: ['Approved', 'Rejected', 'Ready for Payment'].includes(newStatus) 
                ? new Date().toISOString() 
                : currentData.status === newStatus 
                  ? undefined 
                  : null,
              reviewer_id: ['Approved', 'Rejected', 'Ready for Payment'].includes(newStatus)
                ? (await supabase.auth.getUser()).data.user?.id
                : currentData.status === newStatus
                  ? undefined
                  : null
            })
            .eq('id', approvalId)
            .select()
            .single();
          
          if (error) throw error;
          
          // Add history entry
          const { error: historyError } = await supabase
            .from('approval_history')
            .insert({
              approval_id: approvalId,
              previous_status: currentData.status,
              new_status: newStatus,
              changed_by: (await supabase.auth.getUser()).data.user?.id,
              notes
            });
          
          if (historyError) {
            console.error('Error adding approval history entry:', historyError);
            // Don't fail the operation just because history entry failed
          }
          
          return data;
        } catch (error) {
          console.error('Error updating approval status:', error);
          throw error;
        }
      },
      onSuccess: (_, { approvalId }) => {
        queryClient.invalidateQueries({ queryKey: ['commission-approval', approvalId] });
        queryClient.invalidateQueries({ queryKey: ['commission-approval-history', approvalId] });
        queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
        queryClient.invalidateQueries({ queryKey: ['approval-status-counts'] });
      }
    });
  };
  
  // Check if a commission amount requires approval
  const useCommissionApprovalCheck = (amount: number) => {
    return useQuery({
      queryKey: ['commission-approval-check', amount],
      queryFn: async () => {
        try {
          // Get the threshold from system configuration
          const { data, error } = await supabase
            .from('system_configuration')
            .select('value')
            .eq('key', 'commission_approval_threshold')
            .single();
          
          if (error) throw error;
          
          const threshold = data ? parseInt(data.value, 10) : 10000; // Default to 10000 if not set
          
          return {
            requiresApproval: amount > threshold,
            threshold
          };
        } catch (error) {
          console.error('Error checking if commission requires approval:', error);
          // Default to requiring approval if we can't determine
          return {
            requiresApproval: true,
            threshold: 10000
          };
        }
      }
    });
  };
  
  // Get a system configuration value
  const useSystemConfiguration = (key: string) => {
    return useQuery({
      queryKey: ['system-configuration', key],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('system_configuration')
            .select('*')
            .eq('key', key)
            .single();
          
          if (error) throw error;
          
          return data;
        } catch (error) {
          console.error(`Error fetching system configuration "${key}":`, error);
          return null;
        }
      }
    });
  };
  
  return {
    useCommissionApprovals,
    useCommissionApprovalDetail,
    useCommissionApprovalHistory,
    useApprovalStatusCounts,
    usePendingCommissionTotal,
    useApprovedCommissionTotal,
    useApprovalComments,
    useAddApprovalCommentMutation,
    useDeleteApprovalCommentMutation,
    useUpdateApprovalStatusMutation,
    useCommissionApprovalCheck,
    useSystemConfiguration
  };
};

export default useCommissionApproval;
