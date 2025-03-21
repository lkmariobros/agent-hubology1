
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

// Helper to make RPC calls with proper typing
const makeRpcCall = async <T>(functionName: string, params?: Record<string, any>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke<T>(functionName, {
    body: params
  });
  
  if (error) {
    console.error(`Error calling RPC ${functionName}:`, error);
    throw error;
  }
  
  return data as T;
};

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
      const params = {
        p_status: status,
        p_user_id: !isAdmin && userId ? userId : null,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize
      };
      
      const approvalData = await makeRpcCall<any[]>('get_commission_approvals', params);
      
      // Validate and transform the data
      const approvals = approvalData ? approvalData : [];
      
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
      const approvalData = await makeRpcCall<any>('get_commission_approval_detail', {
        p_approval_id: approvalId
      });
      
      if (!approvalData) {
        throw new Error("Approval not found");
      }
      
      // Fetch history using RPC
      const historyData = await makeRpcCall<any[]>('get_commission_approval_history', {
        p_approval_id: approvalId
      });
      
      // Fetch comments using RPC
      const commentsData = await makeRpcCall<any[]>('get_commission_approval_comments', {
        p_approval_id: approvalId 
      });
      
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
      const result = await makeRpcCall<any>('update_commission_approval_status', {
        p_approval_id: approvalId,
        p_new_status: status,
        p_notes: notes || null
      });
      
      return result;
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
      const result = await makeRpcCall<any>('add_commission_approval_comment', {
        p_approval_id: approvalId,
        p_content: content
      });
      
      return result;
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
      const result = await makeRpcCall<any>('delete_commission_approval_comment', {
        p_comment_id: commentId
      });
      
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
