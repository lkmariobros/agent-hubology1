import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CommissionInstallment } from '@/types/commission';

// Type definitions
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
  created_by: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

export interface CommissionApproval {
  id: string;
  transaction_id?: string;
  status: string;
  submitted_by?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  notes?: string;
  threshold_exceeded?: boolean;
  created_at: string;
  updated_at?: string;
  transaction?: {
    commission_amount: number;
    transaction_date: string;
    transaction_value?: number;
    commission_rate?: number;
    installments_generated?: boolean;
    property_id?: string;
  };
}

export interface ApprovalDetailResponse {
  approval: CommissionApproval;
  history: ApprovalHistoryItem[];
  installments?: CommissionInstallment[];
}

export interface ApprovalCountResult {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  rejected: number;
}

/**
 * Custom hook for commission approval system functionality
 */
const useCommissionApproval = {
  /**
   * Hook to get system configuration values
   */
  useSystemConfiguration: (configKey: string) => {
    return useQuery({
      queryKey: ['system-config', configKey],
      queryFn: async () => {
        // Default values for testing/development
        const defaultConfigs = {
          commission_approval_threshold: { value: '10000' },
          commission_auto_approve_below: { value: '5000' },
          commission_approval_levels: { value: '3' }
        };
        
        return defaultConfigs[configKey as keyof typeof defaultConfigs] || null;
      }
    });
  },
  
  /**
   * Hook to check if a commission requires approval
   */
  useCommissionApprovalCheck: (amount: number) => {
    // Simple implementation using a fixed threshold
    const requiresApproval = amount >= 10000;
    return { requiresApproval };
  },

  /**
   * Hook to get approval status counts
   */
  useApprovalStatusCounts: () => {
    return useQuery({
      queryKey: ['approval-status-counts'],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke<any>('get_approval_status_counts');
        
        if (error) throw error;
        
        // Map snake_case from API to camelCase for our interface
        return {
          pending: data?.pending || 0,
          underReview: data?.under_review || 0, // Map snake_case to camelCase
          approved: data?.approved || 0,
          readyForPayment: data?.ready_for_payment || 0, // Map snake_case to camelCase
          paid: data?.paid || 0,
          rejected: data?.rejected || 0
        };
      },
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  },

  /**
   * Hook to get pending commission total
   */
  usePendingCommissionTotal: () => {
    return useQuery({
      queryKey: ['pending-commission-total'],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke<{ total: number }>('get_pending_commission_total');
        
        if (error) throw error;
        
        return data?.total || 0;
      },
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  },
  
  /**
   * Hook to get approved commission total
   */
  useApprovedCommissionTotal: () => {
    return useQuery({
      queryKey: ['approved-commission-total'],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke<{ total: number }>('get_approved_commission_total');
        
        if (error) throw error;
        
        return data?.total || 0;
      },
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  },
  
  /**
   * Hook to get commission approvals
   */
  useCommissionApprovals: (status?: string, includeDetails = false, userId?: string, page = 1, pageSize = 10) => {
    return useQuery({
      queryKey: ['commission-approvals', status, includeDetails, userId, page, pageSize],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke<{
          approvals: CommissionApproval[];
          totalCount: number;
        }>('get_commission_approvals', {
          body: {
            p_status: status,
            p_user_id: userId,
            p_limit: pageSize,
            p_offset: (page - 1) * pageSize
          }
        });
        
        if (error) throw error;
        
        return {
          approvals: data?.approvals || [],
          totalCount: data?.totalCount || 0
        };
      },
      staleTime: 60 * 1000 // 1 minute
    });
  },
  
  /**
   * Hook to get commission approval detail
   */
  useCommissionApprovalDetail: (approvalId: string) => {
    return useQuery({
      queryKey: ['commission-approval-detail', approvalId],
      enabled: !!approvalId,
      queryFn: async () => {
        const [detailResponse, historyResponse] = await Promise.all([
          supabase.functions.invoke<{ approval: CommissionApproval; installments?: CommissionInstallment[] }>('get_commission_approval_detail', {
            body: { p_approval_id: approvalId }
          }),
          supabase.functions.invoke<ApprovalHistoryItem[]>('get_commission_approval_history', {
            body: { p_approval_id: approvalId }
          })
        ]);
        
        if (detailResponse.error) throw detailResponse.error;
        if (historyResponse.error) throw historyResponse.error;
        
        return {
          approval: detailResponse.data?.approval,
          history: historyResponse.data || [],
          installments: detailResponse.data?.installments
        } as ApprovalDetailResponse;
      },
      staleTime: 60 * 1000 // 1 minute
    });
  },
  
  /**
   * Hook to update approval status
   */
  useUpdateApprovalStatusMutation: () => {
    const queryClient = useQueryClient();
    const sendNotification = useSendNotification();
    
    return useMutation({
      mutationFn: async ({ approvalId, newStatus, notes }: { 
        approvalId: string; 
        newStatus: string; 
        notes?: string;
      }) => {
        const { data, error } = await supabase.functions.invoke('update_commission_approval_status', {
          body: {
            p_approval_id: approvalId,
            p_new_status: newStatus,
            p_notes: notes
          }
        });
        
        if (error || (data && !data.success)) {
          throw new Error(error?.message || (data && data.message) || 'Failed to update status');
        }
        
        return data;
      },
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['commission-approval-detail', variables.approvalId] });
        queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
        queryClient.invalidateQueries({ queryKey: ['approval-status-counts'] });
        queryClient.invalidateQueries({ queryKey: ['pending-commission-total'] });
        queryClient.invalidateQueries({ queryKey: ['approved-commission-total'] });
        
        // Show success message
        toast.success(`Status updated to ${variables.newStatus}`, {
          description: variables.notes ? `Note: ${variables.notes}` : undefined
        });
      },
      onError: (error: Error) => {
        toast.error('Failed to update status', {
          description: error.message
        });
      }
    });
  },
  
  /**
   * Hook to get approval comments
   */
  useApprovalComments: (approvalId: string) => {
    return useQuery({
      queryKey: ['approval-comments', approvalId],
      enabled: !!approvalId,
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke<ApprovalComment[]>('get_commission_approval_comments', {
          body: { p_approval_id: approvalId }
        });
        
        if (error) throw error;
        
        return data || [];
      },
      staleTime: 60 * 1000 // 1 minute
    });
  },
  
  /**
   * Hook to add approval comment
   */
  useAddApprovalCommentMutation: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ approvalId, comment }: { approvalId: string; comment: string }) => {
        const { data, error } = await supabase.functions.invoke('add_commission_approval_comment', {
          body: {
            p_approval_id: approvalId,
            p_comment: comment
          }
        });
        
        if (error) throw error;
        
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['approval-comments', variables.approvalId] });
        toast.success('Comment added');
      },
      onError: (error: Error) => {
        toast.error('Failed to add comment', {
          description: error.message
        });
      }
    });
  },
  
  /**
   * Hook to delete approval comment
   */
  useDeleteApprovalCommentMutation: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ commentId, approvalId }: { commentId: string; approvalId: string }) => {
        const { data, error } = await supabase.functions.invoke('delete_commission_approval_comment', {
          body: {
            p_comment_id: commentId
          }
        });
        
        if (error) throw error;
        
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['approval-comments', variables.approvalId] });
        toast.success('Comment deleted');
      },
      onError: (error: Error) => {
        toast.error('Failed to delete comment', {
          description: error.message
        });
      }
    });
  }
};

// Import for sendNotification functionality
import { useSendNotification } from './useSendNotification';

export default useCommissionApproval;
