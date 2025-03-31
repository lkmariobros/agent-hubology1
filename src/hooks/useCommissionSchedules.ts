
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CommissionPaymentSchedule, CommissionInstallment } from '@/types/commission';

/**
 * Hook for managing commission payment schedules
 */
const useCommissionSchedules = () => {
  const queryClient = useQueryClient();

  /**
   * Get payment schedules by agent ID
   */
  const useAgentPaymentSchedules = (agentId?: string) => {
    return useQuery({
      queryKey: ['payment-schedules', 'agent', agentId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('commission_payment_schedules')
          .select(`
            *,
            commission_installments(*)
          `)
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as CommissionPaymentSchedule[];
      },
      enabled: !!agentId
    });
  };

  /**
   * Get payment schedules by approval ID
   */
  const useApprovalPaymentSchedule = (approvalId?: string) => {
    return useQuery({
      queryKey: ['payment-schedules', 'approval', approvalId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('commission_payment_schedules')
          .select(`
            *,
            commission_installments(*)
          `)
          .eq('commission_approval_id', approvalId)
          .single();

        if (error) throw error;
        return data as CommissionPaymentSchedule;
      },
      enabled: !!approvalId
    });
  };

  /**
   * Get all pending installments
   */
  const usePendingInstallments = (limit = 100) => {
    return useQuery({
      queryKey: ['installments', 'pending', limit],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('commission_installments')
          .select(`
            *,
            commission_payment_schedules!inner(
              *,
              commission_approvals(*),
              property_transactions(*)
            )
          `)
          .eq('status', 'Pending')
          .order('due_date', { ascending: true })
          .limit(limit);

        if (error) throw error;
        return data as (CommissionInstallment & {
          commission_payment_schedules: CommissionPaymentSchedule & {
            commission_approvals: any;
            property_transactions: any;
          };
        })[];
      }
    });
  };

  /**
   * Generate a new payment schedule for an approval
   */
  const useGenerateScheduleMutation = () => {
    return useMutation({
      mutationFn: async ({
        approvalId,
        installmentCount,
        startDate
      }: {
        approvalId: string;
        installmentCount?: number;
        startDate?: string;
      }) => {
        const { data, error } = await supabase.rpc('generate_payment_schedule', {
          p_approval_id: approvalId,
          p_installment_count: installmentCount || null,
          p_start_date: startDate || null
        });

        if (error) throw error;
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
        queryClient.invalidateQueries({ queryKey: ['commission-approval-detail', variables.approvalId] });
        toast.success('Payment schedule generated successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to generate payment schedule', {
          description: error.message
        });
      }
    });
  };

  /**
   * Update installment status
   */
  const useUpdateInstallmentStatusMutation = () => {
    return useMutation({
      mutationFn: async ({
        installmentId,
        status,
        notes
      }: {
        installmentId: string;
        status: CommissionInstallment['status'];
        notes?: string;
      }) => {
        const updates: any = {
          status,
          notes
        };

        // Add payment date and processor if marked as paid
        if (status === 'Paid') {
          updates.payment_date = new Date().toISOString();
          updates.processed_by = supabase.auth.getUser().then(res => res.data.user?.id);
        }

        const { data, error } = await supabase
          .from('commission_installments')
          .update(updates)
          .eq('id', installmentId)
          .select()
          .single();

        if (error) throw error;

        // If marking as paid, also update remaining amount in the schedule
        if (status === 'Paid') {
          const { data: installment } = await supabase
            .from('commission_installments')
            .select('amount, schedule_id')
            .eq('id', installmentId)
            .single();

          if (installment) {
            await supabase
              .from('commission_payment_schedules')
              .update({
                remaining_amount: supabase.rpc('subtract_from_remaining', {
                  schedule_id: installment.schedule_id,
                  amount: installment.amount
                }),
                updated_at: new Date().toISOString()
              })
              .eq('id', installment.schedule_id);
          }
        }

        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['installments'] });
        queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
        toast.success('Installment status updated');
      },
      onError: (error: Error) => {
        toast.error('Failed to update installment status', {
          description: error.message
        });
      }
    });
  };

  return {
    useAgentPaymentSchedules,
    useApprovalPaymentSchedule,
    usePendingInstallments,
    useGenerateScheduleMutation,
    useUpdateInstallmentStatusMutation
  };
};

export default useCommissionSchedules;
