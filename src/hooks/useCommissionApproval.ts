import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { castParam, safelyExtractProperty } from '@/utils/supabaseHelpers';

// Define approval status type
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

// Define approval comment interfaces
export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  comment_text: string;
  created_at: string;
  created_by: string;
  user?: {
    name?: string;
    email?: string;
  };
}

// Define approval history interfaces
export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: ApprovalStatus;
  new_status: ApprovalStatus;
  changed_by: string;
  notes?: string;
  created_at: string;
  changed_by_user?: {
    name?: string;
    email?: string;
  };
}

/**
 * Hook to fetch system configuration for commission approval
 */
export const useSystemConfiguration = () => {
  return useQuery({
    queryKey: ['systemConfig', 'commission_approval_threshold'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key', castParam('commission_approval_threshold'))
        .single();
      
      if (error) throw error;
      return {
        threshold: Number(safelyExtractProperty(data, 'value', '10000')),
        key: safelyExtractProperty(data, 'key', 'commission_approval_threshold'),
        description: safelyExtractProperty(data, 'description', 'Commission amount threshold that requires approval')
      };
    }
  });
};

/**
 * Hook to check if commission amount exceeds approval threshold
 */
export const useCommissionApprovalCheck = (commissionAmount: number) => {
  return useQuery({
    queryKey: ['commissionApprovalCheck', commissionAmount],
    queryFn: async () => {
      // Get threshold from configuration
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .eq('key', castParam('commission_approval_threshold'))
        .single();
      
      if (error) throw error;
      
      const threshold = Number(safelyExtractProperty(data, 'value', '10000'));
      const exceedsThreshold = commissionAmount > threshold;
      
      return {
        threshold,
        exceedsThreshold,
        approvalRequired: exceedsThreshold
      };
    },
    select: (data) => ({
      threshold: data.threshold,
      exceedsThreshold: data.exceedsThreshold,
      approvalRequired: data.approvalRequired
    })
  });
};

/**
 * Hook to fetch approval status counts
 */
export const useApprovalStatusCounts = () => {
  return useQuery({
    queryKey: ['approvalStatusCounts'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get_approval_status_counts');
      return data || {
        pending: 0,
        under_review: 0,
        approved: 0,
        ready_for_payment: 0,
        paid: 0,
        rejected: 0
      };
    }
  });
};

/**
 * Hook to fetch total pending commission
 */
export const usePendingCommissionTotal = () => {
  return useQuery({
    queryKey: ['pendingCommissionTotal'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get_pending_commission_total');
      return data || 0;
    }
  });
};

/**
 * Hook to fetch total approved commission
 */
export const useApprovedCommissionTotal = () => {
  return useQuery({
    queryKey: ['approvedCommissionTotal'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get_approved_commission_total');
      return data || 0;
    }
  });
};

/**
 * Hook to fetch commission approvals
 */
export const useCommissionApprovals = (
  status: ApprovalStatus | 'All',
  isAdmin: boolean,
  agentId?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['commissionApprovals', status, isAdmin, agentId, page, pageSize],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get_commission_approvals', {
        body: {
          status: status === 'All' ? undefined : status,
          is_admin: isAdmin,
          agent_id: agentId,
          page,
          page_size: pageSize
        }
      });
      
      return {
        approvals: data?.approvals || [],
        totalCount: data?.total_count || 0
      };
    }
  });
};

/**
 * Hook to fetch commission approval detail
 */
export const useCommissionApprovalDetail = (approvalId: string) => {
  return useQuery({
    queryKey: ['commissionApprovalDetail', approvalId],
    queryFn: async () => {
      if (!approvalId) return null;
      
      const { data } = await supabase.functions.invoke('get_commission_approval_detail', {
        body: { approval_id: approvalId }
      });
      
      return data;
    },
    enabled: !!approvalId
  });
};

/**
 * Hook to fetch approval history
 */
export const useApprovalHistory = (approvalId: string) => {
  return useQuery({
    queryKey: ['approvalHistory', approvalId],
    queryFn: async () => {
      if (!approvalId) return [];
      
      const { data } = await supabase.functions.invoke('get_commission_approval_history', {
        body: { approval_id: approvalId }
      });
      
      return data || [];
    },
    enabled: !!approvalId
  });
};

/**
 * Hook to fetch approval comments
 */
export const useApprovalComments = (approvalId: string) => {
  return useQuery({
    queryKey: ['approvalComments', approvalId],
    queryFn: async () => {
      if (!approvalId) return [];
      
      const { data } = await supabase.functions.invoke('get_commission_approval_comments', {
        body: { approval_id: approvalId }
      });
      
      return data || [];
    },
    enabled: !!approvalId
  });
};

/**
 * Mutation to update approval status
 */
export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      approvalId, 
      status, 
      notes 
    }: { 
      approvalId: string, 
      status: ApprovalStatus, 
      notes?: string 
    }) => {
      const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
        body: {
          approval_id: approvalId,
          new_status: status,
          notes
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Approval status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['commissionApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['approvalStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCommissionTotal'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCommissionTotal'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};

/**
 * Mutation to add approval comment
 */
export const useAddApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      approvalId, 
      commentText 
    }: { 
      approvalId: string, 
      commentText: string 
    }) => {
      const { data, error } = await supabase.functions.invoke('add_commission_approval_comment', {
        body: {
          approval_id: approvalId,
          comment_text: commentText
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success('Comment added successfully');
      queryClient.invalidateQueries({ 
        queryKey: ['approvalComments', variables.approvalId] 
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to add comment: ${error.message}`);
    }
  });
};

/**
 * Mutation to delete approval comment
 */
export const useDeleteApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      commentId,
      approvalId 
    }: { 
      commentId: string,
      approvalId: string
    }) => {
      const { data, error } = await supabase.functions.invoke('delete_commission_approval_comment', {
        body: { comment_id: commentId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ 
        queryKey: ['approvalComments', variables.approvalId] 
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    }
  });
};

// Helper function for direct API calls
export const updateApprovalStatus = async (
  approvalId: string, 
  status: ApprovalStatus, 
  notes?: string
) => {
  const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
    body: {
      approval_id: approvalId,
      new_status: status,
      notes
    }
  });
  
  if (error) throw error;
  return data;
};

// Helper function for direct API calls
export const addApprovalComment = async (
  approvalId: string, 
  commentText: string
) => {
  const { data, error } = await supabase.functions.invoke('add_commission_approval_comment', {
    body: {
      approval_id: approvalId,
      comment_text: commentText
    }
  });
  
  if (error) throw error;
  return data;
};

// Keep other hooks and functions from the original file
export const useApprovalStatusCounts = useQuery;
export const usePendingCommissionTotal = useQuery;
export const useApprovedCommissionTotal = useQuery;
export const useCommissionApprovals = useQuery;
export const useCommissionApprovalDetail = useQuery;
export const useApprovalHistory = useQuery;
export const useApprovalComments = useQuery;
