
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

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
  property_transactions?: {
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
      
      let query = supabase
        .from('commission_approvals')
        .select(`
          *,
          property_transactions(*),
          agent:submitted_by(*)
        `)
        .order('created_at', { ascending: false });
        
      if (status) {
        query = query.eq('status', status);
      }
        
      // No need to filter by user if admin, RLS will handle permissions
        
      query = query.range(offset, offset + pageSize - 1);
        
      const { data, error, count } = await query;
        
      if (error) {
        console.error('Error fetching commission approvals:', error);
        throw error;
      }
        
      return { 
        approvals: data || [],
        totalCount: count || 0
      };
    },
    enabled: !!user
  });
};

// Fetch a single commission approval with details
export const useCommissionApprovalDetail = (approvalId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commissionApproval', approvalId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Fetch approval details
      const { data: approval, error } = await supabase
        .from('commission_approvals')
        .select(`
          *,
          property_transactions(*),
          agent:submitted_by(*),
          reviewer:reviewed_by(*)
        `)
        .eq('id', approvalId)
        .single();
      
      if (error) {
        console.error('Error fetching commission approval:', error);
        throw error;
      }
      
      // Fetch approval history
      const { data: history, error: historyError } = await supabase
        .from('approval_history')
        .select('*')
        .eq('approval_id', approvalId)
        .order('created_at', { ascending: false });
      
      if (historyError) {
        console.error('Error fetching approval history:', historyError);
      }
      
      // Fetch approval comments
      const { data: commentsRaw, error: commentsError } = await supabase
        .from('approval_comments')
        .select('*')
        .eq('approval_id', approvalId)
        .order('created_at', { ascending: true });
      
      if (commentsError) {
        console.error('Error fetching approval comments:', commentsError);
      }
      
      // Map the comments to match our interface
      const comments: CommissionApprovalComment[] = commentsRaw ? commentsRaw.map(comment => ({
        id: comment.id,
        approval_id: comment.approval_id,
        content: comment.comment_text, // Map comment_text to content
        created_by: comment.created_by,
        created_at: comment.created_at
      })) : [];
      
      return {
        approval,
        history: history || [],
        comments
      };
    },
    enabled: !!user && !!approvalId
  });
};

// Fetch status counts for dashboard
export const useApprovalStatusCounts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approvalStatusCounts'],
    queryFn: async (): Promise<ApprovalStatusCounts> => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Use the Edge Function to get status counts
        const { data, error } = await supabase.functions.invoke('get_approval_status_counts');
        
        if (error) throw error;
        
        // Cast the response data to our expected type
        return data as ApprovalStatusCounts;
      } catch (error) {
        console.error('Error fetching approval status counts:', error);
        
        // Fallback to manual calculation if function call fails
        console.warn('Falling back to manual status count calculation');
        const { data: approvals, error: fallbackError } = await supabase
          .from('commission_approvals')
          .select('status');
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        // Calculate counts manually
        const counts: ApprovalStatusCounts = {
          pending: 0,
          under_review: 0,
          approved: 0,
          ready_for_payment: 0,
          paid: 0,
          rejected: 0
        };
        
        approvals?.forEach(item => {
          const status = item.status.toLowerCase().replace(' ', '_');
          if (status in counts) {
            counts[status as keyof ApprovalStatusCounts]++;
          }
        });
        
        return counts;
      }
    },
    enabled: !!user
  });
};

// Fetch approved commission total
export const useApprovedCommissionTotal = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['approvedCommissionTotal'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Use the Edge Function to get approved commission total
        const { data, error } = await supabase.functions.invoke('get_approved_commission_total');
        
        if (error) throw error;
        
        // The edge function returns an object with a total property
        return (data as { total: number }).total;
      } catch (error) {
        console.error('Error fetching approved commission total:', error);
        
        // Fallback to manual calculation if function call fails
        console.warn('Falling back to manual approved commission calculation');
        const { data: approvals, error: fallbackError } = await supabase
          .from('commission_approvals')
          .select('property_transactions(commission_amount)')
          .eq('status', 'Approved');
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        // Calculate the total
        const total = approvals?.reduce((sum, item) => {
          return sum + (item.property_transactions?.commission_amount || 0);
        }, 0) || 0;
        
        return total;
      }
    },
    enabled: !!user
  });
};

// Fetch pending commission total
export const usePendingCommissionTotal = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pendingCommissionTotal'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Use the Edge Function to get pending commission total
        const { data, error } = await supabase.functions.invoke('get_pending_commission_total');
        
        if (error) throw error;
        
        // The edge function returns an object with a total property
        return (data as { total: number }).total;
      } catch (error) {
        console.error('Error fetching pending commission total:', error);
        
        // Fallback to manual calculation if function call fails
        console.warn('Falling back to manual pending commission calculation');
        const { data: approvals, error: fallbackError } = await supabase
          .from('commission_approvals')
          .select('property_transactions(commission_amount)')
          .eq('status', 'Pending');
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        // Calculate the total
        const total = approvals?.reduce((sum, item) => {
          return sum + (item.property_transactions?.commission_amount || 0);
        }, 0) || 0;
        
        return total;
      }
    },
    enabled: !!user
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
      
      try {
        // Use Edge Function instead of direct RPC
        const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
          body: {
            p_approval_id: approvalId,
            p_new_status: status,
            p_notes: notes
          }
        });
        
        if (error) {
          throw error;
        }
        
        // Cast the response to get proper type checking
        const response = data as { success: boolean; message: string };
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update status');
        }
        
        return response;
      } catch (error) {
        console.error('Error updating approval status:', error);
        throw error;
      }
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
        .from('approval_comments')
        .insert({
          approval_id: approvalId,
          comment_text: content,
          created_by: user.id
        })
        .select()
        .single();
      
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
        .from('approval_comments')
        .delete()
        .eq('id', commentId)
        .select();
      
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
