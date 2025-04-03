
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { toast } from 'sonner';

/**
 * Hook for managing payment schedules
 */
export function usePaymentSchedules() {
  const queryClient = useQueryClient();
  
  // Fetch all payment schedules
  const { data: paymentSchedules, isLoading, error } = useQuery({
    queryKey: ['payment-schedules'],
    queryFn: async () => {
      try {
        // Fetch payment schedules
        const { data: schedules, error: schedulesError } = await supabase
          .from('commission_payment_schedules')
          .select('*')
          .order('name');
          
        if (schedulesError) throw schedulesError;
        
        // For each schedule, fetch its installments
        const schedulesWithInstallments = await Promise.all(
          schedules.map(async (schedule) => {
            const { data: installments, error: installmentsError } = await supabase
              .from('schedule_installments')
              .select('*')
              .eq('schedule_id', schedule.id)
              .order('installment_number');
              
            if (installmentsError) throw installmentsError;
            
            // Transform to match our interface
            return {
              id: schedule.id,
              name: schedule.name,
              description: schedule.description,
              isDefault: schedule.is_default,
              createdAt: schedule.created_at,
              updatedAt: schedule.updated_at,
              installments: installments.map(inst => ({
                id: inst.id,
                scheduleId: inst.schedule_id,
                installmentNumber: inst.installment_number,
                percentage: inst.percentage,
                daysAfterTransaction: inst.days_after_transaction,
                description: inst.description
              }))
            };
          })
        );
        
        return schedulesWithInstallments as PaymentSchedule[];
      } catch (err) {
        console.error('Error fetching payment schedules:', err);
        throw err;
      }
    }
  });
  
  // Get default payment schedule
  const defaultPaymentSchedule = paymentSchedules?.find(schedule => schedule.isDefault);
  
  // Create a new payment schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<PaymentSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Insert the schedule
      const { data: newSchedule, error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .insert({
          name: schedule.name,
          description: schedule.description,
          is_default: schedule.isDefault
        })
        .select()
        .single();
        
      if (scheduleError) throw scheduleError;
      
      // Insert the installments
      const installmentsToInsert = schedule.installments.map(installment => ({
        schedule_id: newSchedule.id,
        installment_number: installment.installmentNumber,
        percentage: installment.percentage,
        days_after_transaction: installment.daysAfterTransaction,
        description: installment.description
      }));
      
      const { error: installmentsError } = await supabase
        .from('schedule_installments')
        .insert(installmentsToInsert);
        
      if (installmentsError) throw installmentsError;
      
      return newSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Payment schedule created successfully');
    },
    onError: (error) => {
      console.error('Error creating payment schedule:', error);
      toast.error('Failed to create payment schedule');
    }
  });

  return {
    paymentSchedules,
    defaultPaymentSchedule,
    isLoading,
    error,
    createSchedule: createScheduleMutation.mutate,
    isCreating: createScheduleMutation.isPending
  };
}
