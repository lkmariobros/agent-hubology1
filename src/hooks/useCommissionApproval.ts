
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ApprovalHistoryItem {
  id: string;
  approval_id: string;
  old_status: string;
  new_status: string;
  changed_by: string;
  changed_by_name?: string;
  created_at: string;
}

const useCommissionApproval = () => {
  // Get a list of commission approvals with filtering
  const useCommissionApprovals = (status?: string, sort = 'created_at', order = 'desc', limit = 100) => {
    return useQuery({
      queryKey: ['commission-approvals', { status, sort, order, limit }],
      queryFn: async () => {
        try {
          let query = supabase.from('commission_approvals')
            .select('*')
            .order(sort, { ascending: order === 'asc' })
            .limit(limit);
          
          if (status) {
            query = query.eq('status', status);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          
          return data || [];
        } catch (error) {
          console.error('Error fetching commission approvals:', error);
          toast.error('Failed to load commission approvals');
          throw error;
        }
      }
    });
  };
  
  // Get a single commission approval detail
  const useCommissionApprovalDetail = (id?: string) => {
    return useQuery({
      queryKey: ['commission-approval', id],
      queryFn: async () => {
        if (!id) return null;
        
        try {
          const { data, error } = await supabase
            .from('commission_approvals')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          return data;
        } catch (error) {
          console.error('Error fetching commission approval detail:', error);
          toast.error('Failed to load commission approval details');
          throw error;
        }
      },
      enabled: !!id
    });
  };
  
  // Get history for a specific approval
  const useCommissionApprovalHistory = (approvalId?: string) => {
    return useQuery({
      queryKey: ['commission-approval-history', approvalId],
      queryFn: async () => {
        if (!approvalId) return [];
        
        try {
          const { data, error } = await supabase
            .from('commission_approval_history')
            .select('*')
            .eq('approval_id', approvalId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          return data as ApprovalHistoryItem[];
        } catch (error) {
          console.error('Error fetching commission approval history:', error);
          toast.error('Failed to load approval history');
          throw error;
        }
      },
      enabled: !!approvalId
    });
  };
  
  return {
    useCommissionApprovals,
    useCommissionApprovalDetail,
    useCommissionApprovalHistory
  };
};

export default useCommissionApproval;
