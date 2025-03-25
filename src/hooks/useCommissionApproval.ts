
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  notes: string;
  created_at: string;
}

export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  created_by: string;
  comment_text: string;
  created_at: string;
}

export interface CommissionApprovalOptions {
  includeTransaction?: boolean;
  includeAgent?: boolean;
  includeHistory?: boolean;
  includeComments?: boolean;
}

export const useCommissionApproval = () => {
  // Get approval by transaction ID
  const getApprovalByTransactionId = useCallback(async (
    transactionId: string,
    options: CommissionApprovalOptions = {}
  ) => {
    try {
      // Build the query based on options
      let query = supabase
        .from('commission_approvals')
        .select(`
          *
          ${options.includeTransaction ? ', property_transactions(*)' : ''}
          ${options.includeAgent ? ', agent:submitted_by(*)' : ''}
        `)
        .eq('transaction_id', transactionId)
        .single();

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching approval:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      // If history is requested, fetch it separately
      let historyData = [];
      if (options.includeHistory) {
        const { data: history, error: historyError } = await supabase
          .from('approval_history')
          .select('*')
          .eq('approval_id', data.id)
          .order('created_at', { ascending: true });

        if (historyError) {
          console.error('Error fetching approval history:', historyError);
        } else {
          historyData = history;
        }
      }

      // If comments are requested, fetch them separately
      let commentsData = [];
      if (options.includeComments) {
        const { data: comments, error: commentsError } = await supabase
          .from('approval_comments')
          .select('*')
          .eq('approval_id', data.id)
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Error fetching approval comments:', commentsError);
        } else {
          commentsData = comments;
        }
      }

      // Return combined data
      return {
        ...data,
        history: options.includeHistory ? historyData : undefined,
        comments: options.includeComments ? commentsData : undefined
      };
    } catch (error) {
      console.error('Error in getApprovalByTransactionId:', error);
      throw error;
    }
  }, []);

  // Get approval history
  const getApprovalHistory = useCallback(async (approvalId: string): Promise<CommissionApprovalHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('approval_history')
        .select('*')
        .eq('approval_id', approvalId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching approval history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getApprovalHistory:', error);
      throw error;
    }
  }, []);

  // Get approval comments
  const getApprovalComments = useCallback(async (approvalId: string): Promise<CommissionApprovalComment[]> => {
    try {
      const { data, error } = await supabase
        .from('approval_comments')
        .select('*')
        .eq('approval_id', approvalId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching approval comments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getApprovalComments:', error);
      throw error;
    }
  }, []);

  // Update approval status
  const updateApprovalStatus = useCallback(async (
    approvalId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from('commission_approvals')
        .update({
          status: newStatus,
          notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewer_id: '00000000-0000-0000-0000-000000000000' // This would be the current user ID in a real app
        })
        .eq('id', approvalId);

      if (error) {
        console.error('Error updating approval status:', error);
        throw error;
      }

      toast.success(`Commission ${newStatus.toLowerCase()} successfully`);
      return true;
    } catch (error) {
      console.error('Error in updateApprovalStatus:', error);
      toast.error(`Failed to update approval: ${error}`);
      throw error;
    }
  }, []);

  // Add a comment to an approval
  const addComment = useCallback(async (approvalId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('approval_comments')
        .insert({
          approval_id: approvalId,
          comment_text: content,
          created_by: '00000000-0000-0000-0000-000000000000' // This would be the current user ID in a real app
        });

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      console.error('Error in addComment:', error);
      toast.error(`Failed to add comment: ${error}`);
      throw error;
    }
  }, []);

  // Return the API
  return {
    getApprovalByTransactionId,
    getApprovalHistory,
    getApprovalComments,
    updateApprovalStatus,
    addComment
  };
};

// System configuration hook
export const useSystemConfiguration = () => {
  const getCommissionThreshold = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', 'commission_approval_threshold')
        .single();

      if (error) {
        console.error('Error fetching commission threshold:', error);
        throw error;
      }

      return parseFloat(data?.value || '10000');
    } catch (error) {
      console.error('Error in getCommissionThreshold:', error);
      // Return default value if there's an error
      return 10000;
    }
  }, []);

  const updateCommissionThreshold = useCallback(async (value: number) => {
    try {
      const { error } = await supabase
        .from('system_configuration')
        .update({ value: value.toString() })
        .eq('key', 'commission_approval_threshold');

      if (error) {
        console.error('Error updating commission threshold:', error);
        throw error;
      }

      toast.success('Commission threshold updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateCommissionThreshold:', error);
      toast.error(`Failed to update threshold: ${error}`);
      throw error;
    }
  }, []);

  return {
    getCommissionThreshold,
    updateCommissionThreshold,
  };
};
