
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for commission approval
export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';
  submitted_by: string;
  reviewed_by?: string;
  threshold_exceeded: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
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

export interface TransactionDetails {
  transaction_value: number;
  commission_amount: number;
  transaction_date: string;
  property_id?: string;
  commission_rate?: number;
  agent_id?: string;
  notes?: string;
}

// Fetch approvals with filters
export const useCommissionApprovals = (
  status?: string,
  isAdmin = false,
  userId?: string,
  page = 1,
  pageSize = 10
) => {
  const queryKey = ['commission-approvals', status, isAdmin, userId, page, pageSize];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Use RPC function instead of direct table access
      const { data, error } = await supabase.rpc(
        'get_commission_approvals',
        {
          p_status: status,
          p_user_id: !isAdmin && userId ? userId : null,
          p_limit: pageSize,
          p_offset: (page - 1) * pageSize
        }
      );
      
      if (error) {
        console.error('Error fetching commission approvals:', error);
        throw error;
      }
      
      // Validate and transform the data
      const approvals = data ? (data as any[]).map(item => ({
        ...item
      })) : [];
      
      return {
        approvals: approvals as (CommissionApproval & {
          property_transactions: TransactionDetails;
        })[],
        totalCount: approvals.length
      };
    },
    enabled: !!userId
  });
};

// Fetch a single approval with history and comments
export const useCommissionApprovalDetail = (approvalId?: string, isAdmin = false) => {
  return useQuery({
    queryKey: ['commission-approval', approvalId, isAdmin],
    queryFn: async () => {
      if (!approvalId) throw new Error("Approval ID is required");
      
      // Fetch approval details using RPC
      const { data: approvalData, error: approvalError } = await supabase.rpc(
        'get_commission_approval_detail',
        { p_approval_id: approvalId }
      );
      
      if (approvalError) {
        console.error('Error fetching approval:', approvalError);
        throw approvalError;
      }
      
      if (!approvalData) {
        throw new Error("Approval not found");
      }
      
      // Fetch history using RPC
      const { data: historyData, error: historyError } = await supabase.rpc(
        'get_commission_approval_history',
        { p_approval_id: approvalId }
      );
      
      if (historyError) {
        console.error('Error fetching approval history:', historyError);
        throw historyError;
      }
      
      // Fetch comments using RPC
      const { data: commentsData, error: commentsError } = await supabase.rpc(
        'get_commission_approval_comments',
        { p_approval_id: approvalId }
      );
      
      if (commentsError) {
        console.error('Error fetching approval comments:', commentsError);
        throw commentsError;
      }
      
      // Process and type-cast the data
      const approval = approvalData as unknown as CommissionApproval & { 
        property_transactions: TransactionDetails 
      };
      
      const history = historyData ? 
        (historyData as unknown as CommissionApprovalHistory[]) : 
        [];
      
      const comments = commentsData ? 
        (commentsData as unknown as CommissionApprovalComment[]) : 
        [];
      
      return {
        approval,
        history,
        comments
      };
    },
    enabled: !!approvalId
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
      const { data, error } = await supabase.rpc('update_commission_approval_status', {
        p_approval_id: approvalId,
        p_new_status: status,
        p_notes: notes || null
      });
      
      if (error) {
        console.error('Error updating approval status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      
      toast.success(`Approval status updated to ${variables.status}`);
    },
    onError: (error) => {
      toast.error(`Error updating approval status: ${error.message}`);
    }
  });
};

// Add comment to approval
export const useAddApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      approvalId,
      content
    }: {
      approvalId: string;
      content: string;
    }) => {
      const { data, error } = await supabase.rpc('add_commission_approval_comment', {
        p_approval_id: approvalId,
        p_content: content
      });
      
      if (error) {
        console.error('Error adding approval comment:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      toast.error(`Error adding comment: ${error.message}`);
    }
  });
};

// Delete comment from approval
export const useDeleteApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      commentId,
      approvalId
    }: {
      commentId: string;
      approvalId: string;
    }) => {
      const { error } = await supabase.rpc('delete_commission_approval_comment', {
        p_comment_id: commentId
      });
      
      if (error) {
        console.error('Error deleting approval comment:', error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commission-approval', variables.approvalId] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error(`Error deleting comment: ${error.message}`);
    }
  });
};

// Get system configuration value
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['system-configuration', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) {
        console.error(`Error fetching configuration for ${key}:`, error);
        throw error;
      }
      
      return data?.value;
    }
  });
};

// Update system configuration value (admin only)
export const useUpdateSystemConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      key,
      value,
      description
    }: {
      key: string;
      value: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('system_configuration')
        .upsert({
          key,
          value,
          description,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating system configuration:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['system-configuration', variables.key] });
      toast.success(`Configuration ${variables.key} updated successfully`);
    },
    onError: (error) => {
      toast.error(`Error updating configuration: ${error.message}`);
    }
  });
};
