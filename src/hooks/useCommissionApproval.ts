
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CommissionApproval, CommissionApprovalHistory, CommissionApprovalComment } from '@/types';

// Get all commission approvals with optional filtering by status
export const useCommissionApprovals = (status?: string, isAdmin = false, userId?: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['commission-approvals', status, isAdmin, userId, page, pageSize],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get_commission_approvals', {
          body: {
            p_status: status,
            p_user_id: !isAdmin ? userId : null,
            p_limit: pageSize,
            p_offset: (page - 1) * pageSize
          }
        });
        
        if (error) throw error;
        
        return { approvals: data || [] };
      } catch (error: any) {
        console.error('Error fetching commission approvals:', error);
        throw new Error(error.message);
      }
    },
    enabled: !!userId
  });
};

// Get pending commission approvals for bulk actions
export const usePendingCommissionApprovals = () => {
  return useCommissionApprovals('Pending', true);
};

// Get commission approval stats
export const useCommissionApprovalStats = () => {
  return useQuery({
    queryKey: ['commission-approval-stats'],
    queryFn: async () => {
      try {
        // Get status counts
        const { data: countsData, error: countsError } = await supabase.functions.invoke('get_approval_status_counts');
        
        if (countsError) throw countsError;
        
        // Get pending commission total
        const { data: pendingData, error: pendingError } = await supabase.functions.invoke('get_pending_commission_total');
        
        if (pendingError) throw pendingError;
        
        // Get approved commission total
        const { data: approvedData, error: approvedError } = await supabase.functions.invoke('get_approved_commission_total');
        
        if (approvedError) throw approvedError;
        
        return {
          stats: {
            pending: countsData?.pending || 0,
            underReview: countsData?.under_review || 0,
            approved: countsData?.approved || 0,
            readyForPayment: countsData?.ready_for_payment || 0,
            paid: countsData?.paid || 0,
            rejected: countsData?.rejected || 0,
            pendingValue: pendingData?.total || 0,
            approvedValue: approvedData?.total || 0,
            paidValue: 0 // We'll need to add this data fetch later
          }
        };
      } catch (error: any) {
        console.error('Error fetching approval stats:', error);
        throw new Error(error.message);
      }
    }
  });
};

// Get a specific commission approval by ID with detailed information
export const useCommissionApprovalDetail = (id: string, includeHistory = false) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['commission-approval-detail', id],
    queryFn: async () => {
      try {
        // Get the approval details
        const { data: approvalData, error: approvalError } = await supabase.functions.invoke('get_commission_approval_detail', {
          body: { p_approval_id: id }
        });
        
        if (approvalError) throw approvalError;
        
        // Get the approval history if requested
        let historyData: CommissionApprovalHistory[] = [];
        if (includeHistory) {
          const { data: history, error: historyError } = await supabase.functions.invoke('get_commission_approval_history', {
            body: { p_approval_id: id }
          });
          
          if (historyError) throw historyError;
          historyData = history || [];
        }
        
        // Get comments
        const { data: commentsData, error: commentsError } = await supabase.functions.invoke('get_commission_approval_comments', {
          body: { p_approval_id: id }
        });
        
        if (commentsError) throw commentsError;
        
        return {
          approval: approvalData,
          history: historyData,
          comments: commentsData || []
        };
      } catch (error: any) {
        console.error(`Error fetching commission approval ${id}:`, error);
        throw new Error(error.message);
      }
    },
    enabled: !!id
  });
};

// Get system configuration
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['system-config', key],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('system_configuration')
          .select('value')
          .eq('key', key)
          .single();
        
        if (error) {
          console.error(`Error fetching system config ${key}:`, error);
          return null;
        }
        
        return data?.value;
      } catch (error: any) {
        console.error(`Error fetching system config ${key}:`, error);
        return null;
      }
    }
  });
};

// Update approval status
export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      approvalId, 
      status, 
      notes 
    }: { 
      approvalId: string; 
      status: string; 
      notes?: string 
    }) => {
      try {
        const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
          body: {
            p_approval_id: approvalId,
            p_new_status: status,
            p_notes: notes
          }
        });
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error updating approval status:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['commission-approval-detail', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
      
      toast.success(`Status updated to ${variables.status}`);
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};

// Add comment to approval
export const useAddCommissionApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      approvalId, 
      content 
    }: { 
      approvalId: string; 
      content: string; 
    }) => {
      try {
        const { data, error } = await supabase.functions.invoke('add_commission_approval_comment', {
          body: {
            p_approval_id: approvalId,
            p_content: content
          }
        });
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error adding comment:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate the query to refresh comments
      queryClient.invalidateQueries({ queryKey: ['commission-approval-detail', variables.approvalId] });
      toast.success('Comment added successfully');
    }
  });
};

// Delete comment
export const useDeleteCommissionApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('delete_commission_approval_comment', {
          body: {
            p_comment_id: commentId
          }
        });
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error deleting comment:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate all approval details queries to refresh comments
      queryClient.invalidateQueries({ queryKey: ['commission-approval-detail'] });
    }
  });
};

// Bulk approve commissions
export const useBulkApproveCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        const results = await Promise.all(
          ids.map(id => 
            supabase.functions.invoke('update_commission_approval_status', {
              body: {
                p_approval_id: id,
                p_new_status: 'Approved',
                p_notes: 'Approved via bulk action'
              }
            })
          )
        );
        
        const errors = results.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) {
          throw new Error(`${errors.length} errors occurred during bulk approval`);
        }
        
        return { success: true };
      } catch (error: any) {
        console.error('Error during bulk approve:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
    }
  });
};

// Bulk reject commissions
export const useBulkRejectCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        const results = await Promise.all(
          ids.map(id => 
            supabase.functions.invoke('update_commission_approval_status', {
              body: {
                p_approval_id: id,
                p_new_status: 'Rejected',
                p_notes: 'Rejected via bulk action'
              }
            })
          )
        );
        
        const errors = results.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) {
          throw new Error(`${errors.length} errors occurred during bulk rejection`);
        }
        
        return { success: true };
      } catch (error: any) {
        console.error('Error during bulk reject:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
    }
  });
};
