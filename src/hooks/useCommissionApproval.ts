import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import useAuth from './useAuth';

// Types for approval data
export interface ApprovalStatus {
  status: string;
  count: number;
}

export interface ApprovalCountResult {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  rejected: number;
  total: number;
}

export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: string;
  submitted_by: string;
  reviewer_id?: string;
  notes?: string;
  threshold_exceeded: boolean;
  created_at: string;
  updated_at: string;
  transaction?: {
    id: string;
    property_id: string;
    property_title?: string;
    commission_amount: number;
    transaction_date: string;
    agent_id: string;
    agent_name?: string;
  };
}

export interface ApprovalSettings {
  key: string;
  value: string | number;
  description?: string;
}

export interface ApprovalHistoryItem {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  changed_by_name?: string;
  notes?: string;
  created_at: string;
}

export interface ApprovalComment {
  id: string;
  approval_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

// Helper function to map raw database data to properly typed objects
const mapApprovalData = (data: any[]): CommissionApproval[] => {
  return data.map(item => ({
    id: item.id,
    transaction_id: item.transaction_id,
    status: item.status,
    submitted_by: item.submitted_by,
    reviewer_id: item.reviewer_id,
    notes: item.notes,
    threshold_exceeded: item.threshold_exceeded,
    created_at: item.created_at,
    updated_at: item.updated_at,
    transaction: item.transactions ? {
      id: item.transactions.id,
      property_id: item.transactions.property_id,
      property_title: item.transactions.property_title,
      commission_amount: item.transactions.commission_amount,
      transaction_date: item.transactions.transaction_date,
      agent_id: item.transactions.agent_id,
      agent_name: item.transactions.agent_name
    } : undefined
  }));
};

/**
 * Hook to get approval threshold setting
 */
export const useApprovalThreshold = () => {
  const { data: threshold, isLoading, error } = useQuery({
    queryKey: ['approval-threshold'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key' as any, 'commission_approval_threshold' as any)
        .single();
      
      if (error) {
        console.error('Error fetching approval threshold:', error);
        return { value: '10000', key: 'commission_approval_threshold', description: 'Default threshold' };
      }
      
      return {
        value: data.value,
        key: data.key,
        description: data.description
      };
    }
  });
  
  return {
    threshold: threshold ? Number(threshold.value) : 10000,
    isLoading,
    error
  };
};

/**
 * Hook to get approval auto-approval days setting
 */
export const useAutoApprovalDays = () => {
  const { data: setting, isLoading, error } = useQuery({
    queryKey: ['auto-approval-days'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key' as any, 'auto_approval_days' as any)
        .single();
      
      if (error) {
        console.error('Error fetching auto approval days:', error);
        return { value: '7', key: 'auto_approval_days', description: 'Default auto-approval days' };
      }
      
      return {
        value: data.value,
        key: data.key,
        description: data.description
      };
    }
  });
  
  return {
    days: setting ? Number(setting.value) : 7,
    isLoading,
    error
  };
};

/**
 * Hook to get counts of approvals by status
 */
export const useApprovalStatusCounts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approval-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_approval_counts')
        .select('*');
      
      if (error) {
        console.error('Error fetching approval counts:', error);
        return {
          pending: 0,
          underReview: 0,
          approved: 0,
          readyForPayment: 0,
          paid: 0,
          rejected: 0,
          total: 0
        } as ApprovalCountResult;
      }
      
      // Transform the data into a structured object
      const counts = {
        pending: 0,
        underReview: 0,
        approved: 0,
        readyForPayment: 0,
        paid: 0,
        rejected: 0,
        total: 0
      };
      
      // If data is an array, transform it
      if (Array.isArray(data)) {
        data.forEach((item: ApprovalStatus) => {
          const status = item.status.toLowerCase().replace(/\s/g, '');
          counts.total += item.count;
          
          switch (status) {
            case 'pending':
              counts.pending = item.count;
              break;
            case 'underreview':
              counts.underReview = item.count;
              break;
            case 'approved':
              counts.approved = item.count;
              break;
            case 'readyforpayment':
              counts.readyForPayment = item.count;
              break;
            case 'paid':
              counts.paid = item.count;
              break;
            case 'rejected':
              counts.rejected = item.count;
              break;
          }
        });
      }
      
      return counts as ApprovalCountResult;
    },
    enabled: !!user
  });
};

/**
 * Hook to get the total pending commission amount
 */
export const usePendingCommissionTotal = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pending-commission-total'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_pending_commission_total')
        .single();
      
      if (error) {
        console.error('Error fetching pending commission total:', error);
        return 0;
      }
      
      return (data as any)?.total || 0;
    },
    enabled: !!user
  });
};

/**
 * Hook to get the total approved commission amount
 */
export const useApprovedCommissionTotal = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approved-commission-total'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_approved_commission_total')
        .single();
      
      if (error) {
        console.error('Error fetching approved commission total:', error);
        return 0;
      }
      
      return (data as any)?.total || 0;
    },
    enabled: !!user
  });
};

// The fix for the count method in the useCommissionApprovals function
export const useCommissionApprovals = (
  status?: string,
  isAdmin?: boolean,
  agentId?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commission-approvals', status, isAdmin, agentId, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('commission_approvals')
        .select(`
          *,
          transactions:transaction_id (
            id,
            property_id,
            property_title,
            commission_amount,
            transaction_date,
            agent_id,
            agent_name
          )
        `);
      
      if (status && status !== 'All') {
        query = query.eq('status' as any, status as any);
      }
      
      if (agentId) {
        query = query.eq('submitted_by' as any, agentId as any);
      }
      
      // Calculate pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Get total count for pagination - fixed version using count() as a method
      const countQuery = supabase
        .from('commission_approvals')
        .select('*', { count: 'exact', head: true });
      
      // Apply the same filters to count query
      if (status && status !== 'All') {
        countQuery.eq('status' as any, status as any);
      }
      
      if (agentId) {
        countQuery.eq('submitted_by' as any, agentId as any);
      }
      
      // Use the count() method properly
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error counting approvals:', countError);
        return { approvals: [], totalCount: 0 };
      }
      
      // Get paginated data
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error('Error fetching commission approvals:', error);
        return { approvals: [], totalCount: 0 };
      }
      
      return { 
        approvals: mapApprovalData(data || []),
        totalCount: count || 0
      };
    },
    enabled: !!user
  });
};

/**
 * Hook to get a single commission approval with its history
 */
export const useCommissionApprovalDetail = (id?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commission-approval', id],
    queryFn: async () => {
      // Get approval details
      const { data: approvalData, error: approvalError } = await supabase
        .from('commission_approvals')
        .select(`
          *,
          transactions:transaction_id (
            id,
            property_id,
            property_title,
            commission_amount,
            transaction_date,
            agent_id,
            agent_name
          )
        `)
        .eq('id' as any, id as any)
        .single();
      
      if (approvalError) {
        console.error('Error fetching approval detail:', approvalError);
        return { approval: null, history: [] };
      }
      
      // Get approval history
      const { data: historyData, error: historyError } = await supabase
        .from('approval_history')
        .select(`
          *,
          users:changed_by (
            full_name
          )
        `)
        .eq('approval_id' as any, id as any)
        .order('created_at', { ascending: false });
      
      if (historyError) {
        console.error('Error fetching approval history:', historyError);
      }
      
      return {
        approval: mapApprovalData([approvalData])[0],
        history: (historyData || []).map(item => ({
          id: item.id,
          approval_id: item.approval_id,
          previous_status: item.previous_status,
          new_status: item.new_status,
          changed_by: item.changed_by,
          changed_by_name: item.users?.full_name,
          notes: item.notes,
          created_at: item.created_at
        }))
      };
    },
    enabled: !!user && !!id
  });
};

/**
 * Hook to get approval history
 */
export const useApprovalHistory = (approvalId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approval-history', approvalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_history')
        .select(`
          *,
          users:changed_by (
            full_name
          )
        `)
        .eq('approval_id' as any, approvalId as any)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching approval history:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        id: item.id,
        approval_id: item.approval_id,
        previous_status: item.previous_status,
        new_status: item.new_status,
        changed_by: item.changed_by,
        changed_by_name: item.users?.full_name,
        notes: item.notes,
        created_at: item.created_at
      })) as ApprovalHistoryItem[];
    },
    enabled: !!user && !!approvalId
  });
};

/**
 * Hook to get approval comments
 */
export const useApprovalComments = (approvalId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approval-comments', approvalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_comments')
        .select(`
          *,
          users:user_id (
            full_name
          )
        `)
        .eq('approval_id' as any, approvalId as any)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching approval comments:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        id: item.id,
        approval_id: item.approval_id,
        user_id: item.user_id,
        user_name: item.users?.full_name,
        comment: item.comment,
        created_at: item.created_at
      })) as ApprovalComment[];
    },
    enabled: !!user && !!approvalId
  });
};

/**
 * Hook to update approval status
 */
export const useUpdateApprovalStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      approvalId,
      newStatus,
      notes
    }: {
      approvalId: string;
      newStatus: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .rpc('update_commission_approval_status', {
          p_approval_id: approvalId,
          p_new_status: newStatus,
          p_notes: notes || null
        });
      
      if (error) {
        console.error('Error updating approval status:', error);
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['approval-history', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approval-counts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-commission-total'] });
      queryClient.invalidateQueries({ queryKey: ['approved-commission-total'] });
      
      toast.success(`Status updated to ${variables.newStatus}`);
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};

/**
 * Hook to add a comment to an approval
 */
export const useAddApprovalCommentMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      approvalId,
      comment
    }: {
      approvalId: string;
      comment: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('approval_comments')
        .insert({
          approval_id: approvalId,
          user_id: user.id,
          comment
        } as any)
        .select();
      
      if (error) {
        console.error('Error adding comment:', error);
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate comments query
      queryClient.invalidateQueries({ queryKey: ['approval-comments', variables.approvalId] });
      toast.success('Comment added');
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    }
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteApprovalCommentMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      commentId,
      approvalId
    }: {
      commentId: string;
      approvalId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('approval_comments')
        .delete()
        .eq('id' as any, commentId as any)
        .eq('user_id' as any, user.id as any);
      
      if (error) {
        console.error('Error deleting comment:', error);
        throw new Error(error.message);
      }
      
      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate comments query
      queryClient.invalidateQueries({ queryKey: ['approval-comments', variables.approvalId] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    }
  });
};

/**
 * Hook to update approval settings
 */
export const useUpdateApprovalSettingMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      key,
      value,
      description
    }: {
      key: string;
      value: string | number;
      description?: string;
    }) => {
      // First check if the setting exists
      const { data: existing, error: fetchError } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key' as any, key as any)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking for setting:', fetchError);
        throw new Error(fetchError.message);
      }
      
      let result;
      
      if (existing) {
        // Update existing setting
        const { data, error } = await supabase
          .from('system_configuration')
          .update({
            value: String(value),
            description: description || existing.description,
            updated_at: new Date().toISOString()
          } as any)
          .eq('key' as any, key as any)
          .select();
        
        if (error) {
          console.error('Error updating setting:', error);
          throw new Error(error.message);
        }
        
        result = data;
      } else {
        // Insert new setting
        const { data, error } = await supabase
          .from('system_configuration')
          .insert({
            key,
            value: String(value),
            description: description || `Setting for ${key}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as any)
          .select();
        
        if (error) {
          console.error('Error inserting setting:', error);
          throw new Error(error.message);
        }
        
        result = data;
      }
      
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries based on the setting key
      if (variables.key === 'commission_approval_threshold') {
        queryClient.invalidateQueries({ queryKey: ['approval-threshold'] });
      } else if (variables.key === 'auto_approval_days') {
        queryClient.invalidateQueries({ queryKey: ['auto-approval-days'] });
      }
      
      toast.success(`Setting "${variables.key}" updated`);
    },
    onError: (error) => {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  });
};

/**
 * Hook for system configuration settings
 */
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['system-config', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key' as any, key as any)
        .single();
      
      if (error) {
        console.error(`Error fetching configuration for ${key}:`, error);
        return null;
      }
      
      return data;
    }
  });
};

/**
 * Hook for checking if a commission needs approval
 */
export const useCommissionApprovalCheck = (commissionAmount: number) => {
  const { data: thresholdSetting } = useSystemConfiguration('commission_approval_threshold');
  
  const threshold = thresholdSetting ? Number(thresholdSetting.value) : 10000;
  
  return {
    needsApproval: commissionAmount >= threshold,
    threshold
  };
};

// Export all hooks together
const useCommissionApproval = {
  useApprovalThreshold,
  useAutoApprovalDays,
  useApprovalStatusCounts,
  usePendingCommissionTotal,
  useApprovedCommissionTotal,
  useCommissionApprovals,
  useCommissionApprovalDetail,
  useApprovalHistory,
  useApprovalComments,
  useUpdateApprovalStatusMutation,
  useAddApprovalCommentMutation,
  useDeleteApprovalCommentMutation,
  useUpdateApprovalSettingMutation,
  useSystemConfiguration,
  useCommissionApprovalCheck
};

export default useCommissionApproval;
