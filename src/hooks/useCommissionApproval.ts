
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Types for Commission Approval
export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: string;
  submitted_by: string;
  reviewed_by?: string;
  threshold_exceeded: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  property_transactions: {
    transaction_value: number;
    commission_amount: number;
    transaction_date: string;
    property_id?: string;
    commission_rate?: number;
    agent_id: string;
    notes?: string;
  };
}

export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  notes?: string;
  created_at: string;
}

export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

interface ApprovalStatusCounts {
  pending: number;
  under_review: number;
  approved: number;
  ready_for_payment: number;
  paid: number;
  rejected: number;
}

// Fetch the system configuration for commission approval threshold
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['systemConfig', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', key)
        .single();
        
      if (error) {
        console.error(`Error fetching system configuration for ${key}:`, error);
        return null;
      }
      
      return data?.value;
    }
  });
};

// Function to check if a commission requires approval
export const useCommissionApprovalCheck = (commissionAmount: number) => {
  const { data: thresholdValue, isLoading } = useSystemConfiguration('commission_approval_threshold');
  
  // Default threshold if not set in the database
  const threshold = thresholdValue ? parseFloat(thresholdValue) : 10000;
  const exceedsThreshold = commissionAmount > threshold;
  
  return {
    threshold,
    exceedsThreshold,
    isLoading
  };
};

// Fetch commission approvals with filtering
export const useCommissionApprovals = (
  status?: string,
  isAdmin: boolean = false,
  agentId?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const { user } = useAuth();
  const userId = agentId || user?.id;
  const offset = (page - 1) * pageSize;
  
  return useQuery({
    queryKey: ['commissionApprovals', status, isAdmin, userId, page, pageSize],
    queryFn: async () => {
      // Only administrators can see all approvals
      if (!isAdmin && !userId) {
        throw new Error('Unauthorized');
      }
      
      const { data, error } = await supabase
        .functions.invoke('get_commission_approvals', {
          body: {
            status,
            user_id: isAdmin ? undefined : userId,
            limit: pageSize,
            offset
          }
        });
      
      if (error) {
        console.error('Error fetching commission approvals:', error);
        throw error;
      }
      
      return { approvals: data || [] };
    },
    enabled: !!user
  });
};

// Fetch a single commission approval with details
export const useCommissionApprovalDetail = (approvalId: string, isAdmin: boolean = false) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['commissionApproval', approvalId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Fetch approval details
      const { data: approval, error } = await supabase
        .functions.invoke('get_commission_approval_detail', {
          body: { approval_id: approvalId }
        });
      
      if (error) {
        console.error('Error fetching commission approval:', error);
        throw error;
      }
      
      // Fetch approval history
      const { data: history, error: historyError } = await supabase
        .functions.invoke('get_commission_approval_history', {
          body: { approval_id: approvalId }
        });
      
      if (historyError) {
        console.error('Error fetching approval history:', historyError);
      }
      
      // Fetch approval comments
      const { data: comments, error: commentsError } = await supabase
        .functions.invoke('get_commission_approval_comments', {
          body: { approval_id: approvalId }
        });
      
      if (commentsError) {
        console.error('Error fetching approval comments:', commentsError);
      }
      
      return {
        approval,
        history: history || [],
        comments: comments || []
      };
    },
    enabled: !!user && !!approvalId
  });
};

// Fetch status counts for dashboard
export const useApprovalStatusCounts = () => {
  const { user, isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['approvalStatusCounts'],
    queryFn: async (): Promise<ApprovalStatusCounts> => {
      if (!user) throw new Error('User not authenticated');
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase
        .functions.invoke('get_approval_status_counts', {
          body: {}
        });
      
      if (error) {
        console.error('Error fetching approval status counts:', error);
        throw error;
      }
      
      return data || {
        pending: 0,
        under_review: 0,
        approved: 0,
        ready_for_payment: 0,
        paid: 0,
        rejected: 0
      };
    },
    enabled: !!user && isAdmin
  });
};

// Fetch approved commission total
export const useApprovedCommissionTotal = () => {
  const { user, isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['approvedCommissionTotal'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase
        .functions.invoke('get_approved_commission_total', {
          body: {}
        });
      
      if (error) {
        console.error('Error fetching approved commission total:', error);
        throw error;
      }
      
      return data?.total || 0;
    },
    enabled: !!user && isAdmin
  });
};

// Fetch pending commission total
export const usePendingCommissionTotal = () => {
  const { user, isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['pendingCommissionTotal'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase
        .functions.invoke('get_pending_commission_total', {
          body: {}
        });
      
      if (error) {
        console.error('Error fetching pending commission total:', error);
        throw error;
      }
      
      return data?.total || 0;
    },
    enabled: !!user && isAdmin
  });
};

// Update approval status
export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      approvalId,
      status,
      notes
    }: {
      approvalId: string;
      status: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .functions.invoke('update_commission_approval_status', {
          body: {
            approval_id: approvalId,
            new_status: status,
            notes
          }
        });
      
      if (error) {
        console.error('Error updating approval status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commissionApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['approvalStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCommissionTotal'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCommissionTotal'] });
    }
  });
};

// Add comment to approval
export const useAddApprovalComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      approvalId,
      content
    }: {
      approvalId: string;
      content: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .functions.invoke('add_commission_approval_comment', {
          body: {
            approval_id: approvalId,
            content
          }
        });
      
      if (error) {
        console.error('Error adding approval comment:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate query to refresh comments
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
    }
  });
};

// Delete comment from approval
export const useDeleteApprovalComment = () => {
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
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .functions.invoke('delete_commission_approval_comment', {
          body: {
            comment_id: commentId
          }
        });
      
      if (error) {
        console.error('Error deleting approval comment:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate query to refresh comments
      queryClient.invalidateQueries({ queryKey: ['commissionApproval', variables.approvalId] });
    }
  });
};
