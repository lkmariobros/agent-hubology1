
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PaymentSchedule, CommissionInstallment } from '@/types/commission';

/**
 * A hook for managing commission workflow and installments
 */
export function useCommissionWorkflow(transactionId?: string) {
  const queryClient = useQueryClient();

  // Generate installments for a transaction
  const generateInstallments = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await supabase.functions.invoke('generate_commission_installments', {
        body: { transactionId }
      });
      
      if (response.error) throw new Error(response.error.message || 'Failed to generate installments');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionInstallments', transactionId] });
      toast.success('Commission installments generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error generating installments: ${error.message}`);
    }
  });

  // Regenerate installments if needed (e.g. when payment schedule changes)
  const regenerateInstallments = useMutation({
    mutationFn: async ({ 
      transactionId, 
      paymentScheduleId 
    }: { 
      transactionId: string;
      paymentScheduleId?: string;
    }) => {
      // First delete existing installments
      const { error: deleteError } = await supabase
        .from('commission_installments')
        .delete()
        .eq('transaction_id', transactionId);
      
      if (deleteError) throw deleteError;
      
      // Update transaction with the new payment schedule if provided
      if (paymentScheduleId) {
        const { error: updateError } = await supabase
          .from('property_transactions')
          .update({ 
            payment_schedule_id: paymentScheduleId,
            installments_generated: false 
          })
          .eq('id', transactionId);
        
        if (updateError) throw updateError;
      } else {
        // Just mark as not generated
        const { error: updateError } = await supabase
          .from('property_transactions')
          .update({ installments_generated: false })
          .eq('id', transactionId);
        
        if (updateError) throw updateError;
      }
      
      // Now generate new installments
      return generateInstallments.mutateAsync(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionInstallments', transactionId] });
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('Commission installments regenerated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error regenerating installments: ${error.message}`);
    }
  });

  // Get installments for a transaction
  const { data: installments, isLoading: isLoadingInstallments } = useQuery({
    queryKey: ['commissionInstallments', transactionId],
    queryFn: async () => {
      if (!transactionId) return [];
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select('*')
        .eq('transaction_id', transactionId)
        .order('installment_number');
      
      if (error) throw error;
      return data as CommissionInstallment[];
    },
    enabled: !!transactionId
  });

  // Update installment status
  const updateInstallmentStatus = useMutation({
    mutationFn: async ({ 
      installmentId, 
      status, 
      paymentDate 
    }: { 
      installmentId: string;
      status: string;
      paymentDate?: string;
    }) => {
      const { error } = await supabase
        .from('commission_installments')
        .update({ 
          status,
          actual_payment_date: status === 'Paid' ? paymentDate || new Date().toISOString().split('T')[0] : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', installmentId);
      
      if (error) throw error;
      
      return { installmentId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionInstallments', transactionId] });
      toast.success('Installment status updated');
    },
    onError: (error: any) => {
      toast.error(`Error updating installment status: ${error.message}`);
    }
  });

  return {
    installments,
    isLoadingInstallments,
    generateInstallments,
    regenerateInstallments,
    updateInstallmentStatus
  };
}
