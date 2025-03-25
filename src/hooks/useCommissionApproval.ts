
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all commission approvals with optional filtering by status
export const useCommissionApprovals = (status?: string, isAdmin = false, userId?: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['commission-approvals', status, isAdmin, userId, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('commission_approvals')
        .select(`
          *,
          property_transactions (
            id,
            property_id,
            transaction_value,
            commission_amount,
            commission_rate,
            property:property_id (
              id,
              title
            )
          ),
          agent:agent_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      // Apply status filter if provided
      if (status) {
        query = query.eq('status', status);
      }
      
      // If not admin, only show user's own approvals
      if (!isAdmin && userId) {
        query = query.eq('agent_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching commission approvals:', error);
        throw new Error(error.message);
      }
      
      return { approvals: data || [] };
    },
  });
};

// Get pending commission approvals for bulk actions
export const usePendingCommissionApprovals = () => {
  return useQuery({
    queryKey: ['pending-commission-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_approvals')
        .select(`
          *,
          property_transactions (
            id,
            property_id,
            transaction_value,
            commission_amount,
            commission_rate,
            property:property_id (
              id,
              title
            )
          ),
          agent:agent_id (
            id,
            name
          )
        `)
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending approvals:', error);
        throw new Error(error.message);
      }
      
      return { approvals: data || [] };
    },
  });
};

// Get commission approval stats
export const useCommissionApprovalStats = () => {
  return useQuery({
    queryKey: ['commission-approval-stats'],
    queryFn: async () => {
      // Get counts by status
      const { data: statusData, error: statusError } = await supabase
        .from('commission_approvals')
        .select('status, count')
        .select('status')
        .is('deleted_at', null);
      
      if (statusError) {
        console.error('Error fetching approval stats:', statusError);
        throw new Error(statusError.message);
      }
      
      // Get pending value
      const { data: pendingValue, error: pendingError } = await supabase
        .from('commission_approvals')
        .select(`
          property_transactions!inner (
            commission_amount
          )
        `)
        .in('status', ['Pending', 'Under Review'])
        .is('deleted_at', null);
      
      if (pendingError) {
        console.error('Error fetching pending value:', pendingError);
        throw new Error(pendingError.message);
      }
      
      // Get approved value
      const { data: approvedValue, error: approvedError } = await supabase
        .from('commission_approvals')
        .select(`
          property_transactions!inner (
            commission_amount
          )
        `)
        .eq('status', 'Approved')
        .is('deleted_at', null);
      
      if (approvedError) {
        console.error('Error fetching approved value:', approvedError);
        throw new Error(approvedError.message);
      }
      
      // Get paid value
      const { data: paidValue, error: paidError } = await supabase
        .from('commission_approvals')
        .select(`
          property_transactions!inner (
            commission_amount
          )
        `)
        .eq('status', 'Paid')
        .is('deleted_at', null);
      
      if (paidError) {
        console.error('Error fetching paid value:', paidError);
        throw new Error(paidError.message);
      }
      
      // Count statuses
      const pending = statusData.filter(item => item.status === 'Pending').length;
      const underReview = statusData.filter(item => item.status === 'Under Review').length;
      const approved = statusData.filter(item => item.status === 'Approved').length;
      const readyForPayment = statusData.filter(item => item.status === 'Ready for Payment').length;
      const paid = statusData.filter(item => item.status === 'Paid').length;
      
      // Calculate total values
      const pendingAmount = pendingValue.reduce((sum, item) => sum + (item.property_transactions?.commission_amount || 0), 0);
      const approvedAmount = approvedValue.reduce((sum, item) => sum + (item.property_transactions?.commission_amount || 0), 0);
      const paidAmount = paidValue.reduce((sum, item) => sum + (item.property_transactions?.commission_amount || 0), 0);
      
      return {
        stats: {
          pending,
          underReview,
          approved,
          readyForPayment,
          paid,
          pendingValue: pendingAmount,
          approvedValue: approvedAmount,
          paidValue: paidAmount
        }
      };
    },
  });
};

// Get a single commission approval by ID
export const useCommissionApproval = (id: string) => {
  return useQuery({
    queryKey: ['commission-approval', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_approvals')
        .select(`
          *,
          property_transactions (
            *,
            property:property_id (
              *
            ),
            agent:agent_id (
              *
            ),
            co_agent:co_agent_id (
              *
            )
          ),
          agent:agent_id (
            *
          ),
          reviewed_by:reviewer_id (
            *
          ),
          approval_comments (
            *,
            created_by (
              name
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching commission approval ${id}:`, error);
        throw new Error(error.message);
      }
      
      return { approval: data };
    },
    enabled: !!id,
  });
};

// Get system configuration
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['system-config', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) {
        console.error(`Error fetching system config ${key}:`, error);
        return { data: null };
      }
      
      return { data: data?.value };
    },
  });
};

// Bulk approve commissions
export const useBulkApproveCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Get the current user for reviewer ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error. Please sign in again.');
      }
      
      const reviewerId = userData.user?.id;
      
      // Update all selected commissions
      const { data, error } = await supabase
        .from('commission_approvals')
        .update({
          status: 'Approved',
          reviewer_id: reviewerId,
          reviewed_at: new Date().toISOString()
        })
        .in('id', ids);
      
      if (error) {
        console.error('Error approving commissions:', error);
        throw new Error(error.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['pending-commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
    },
  });
};

// Bulk reject commissions
export const useBulkRejectCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Get the current user for reviewer ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error. Please sign in again.');
      }
      
      const reviewerId = userData.user?.id;
      
      // Update all selected commissions
      const { data, error } = await supabase
        .from('commission_approvals')
        .update({
          status: 'Rejected',
          reviewer_id: reviewerId,
          reviewed_at: new Date().toISOString()
        })
        .in('id', ids);
      
      if (error) {
        console.error('Error rejecting commissions:', error);
        throw new Error(error.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['pending-commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
    },
  });
};

// Add a comment to a commission approval
export const useAddApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ approvalId, comment }: { approvalId: string, comment: string }) => {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error. Please sign in again.');
      }
      
      const userId = userData.user?.id;
      
      // Add comment
      const { data, error } = await supabase
        .from('approval_comments')
        .insert({
          approval_id: approvalId,
          comment_text: comment,
          created_by: userId
        });
      
      if (error) {
        console.error('Error adding comment:', error);
        throw new Error(error.message);
      }
      
      return { success: true };
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific commission approval query
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      toast.success('Comment added successfully');
    },
  });
};

// Change commission approval status
export const useChangeApprovalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      approvalId, 
      status, 
      comment 
    }: { 
      approvalId: string, 
      status: string, 
      comment?: string 
    }) => {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error. Please sign in again.');
      }
      
      const userId = userData.user?.id;
      
      // Update approval status
      const { data, error } = await supabase
        .from('commission_approvals')
        .update({
          status: status,
          reviewer_id: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', approvalId);
      
      if (error) {
        console.error('Error updating approval status:', error);
        throw new Error(error.message);
      }
      
      // Add comment if provided
      if (comment) {
        const { error: commentError } = await supabase
          .from('approval_comments')
          .insert({
            approval_id: approvalId,
            comment_text: comment,
            created_by: userId
          });
        
        if (commentError) {
          console.error('Error adding comment:', commentError);
          // Don't throw here, consider it a partial success
        }
      }
      
      return { success: true };
    },
    onSuccess: (_data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval-stats'] });
      
      toast.success(`Status changed to ${variables.status}`);
    },
  });
};
