
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
        console.log('Fetching payment schedules...');
        
        // Fetch payment schedules
        const { data: schedules, error: schedulesError } = await supabase
          .from('commission_payment_schedules')
          .select('*')
          .order('name');
          
        if (schedulesError) {
          console.error('Error fetching payment schedules:', schedulesError);
          throw new Error(`Failed to fetch payment schedules: ${schedulesError.message}`);
        }
        
        // If no schedules found, return empty array
        if (!schedules || schedules.length === 0) {
          console.log('No payment schedules found, using fallback...');
          return getFallbackSchedules();
        }
        
        console.log('Fetched schedules:', schedules);
        
        // For each schedule, fetch its installments
        const schedulesWithInstallments = await Promise.all(
          schedules.map(async (schedule) => {
            try {
              const { data: installments, error: installmentsError } = await supabase
                .from('schedule_installments')
                .select('*')
                .eq('schedule_id', schedule.id)
                .order('installment_number');
                
              if (installmentsError) {
                console.error('Error fetching installments for schedule:', schedule.id, installmentsError);
                return {
                  id: schedule.id,
                  name: schedule.name,
                  description: schedule.description,
                  isDefault: schedule.is_default,
                  createdAt: schedule.created_at,
                  updatedAt: schedule.updated_at,
                  installments: []
                };
              }
              
              // Transform to match our interface
              return {
                id: schedule.id,
                name: schedule.name,
                description: schedule.description,
                isDefault: schedule.is_default,
                createdAt: schedule.created_at,
                updatedAt: schedule.updated_at,
                installments: (installments || []).map(inst => ({
                  id: inst.id,
                  scheduleId: inst.schedule_id,
                  installmentNumber: inst.installment_number,
                  percentage: inst.percentage,
                  daysAfterTransaction: inst.days_after_transaction,
                  description: inst.description
                }))
              };
            } catch (err) {
              console.error('Error processing schedule:', schedule.id, err);
              // Return the schedule without installments rather than failing completely
              return {
                id: schedule.id,
                name: schedule.name,
                description: schedule.description,
                isDefault: schedule.is_default,
                createdAt: schedule.created_at,
                updatedAt: schedule.updated_at,
                installments: []
              };
            }
          })
        );
        
        return schedulesWithInstallments as PaymentSchedule[];
      } catch (err) {
        console.error('Error in usePaymentSchedules hook:', err);
        return getFallbackSchedules();
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Function to get fallback schedules when DB fails
  const getFallbackSchedules = (): PaymentSchedule[] => {
    console.log('Using fallback payment schedules');
    
    // Create a fallback default schedule
    const fallbackSchedule: PaymentSchedule = {
      id: 'default-fallback',
      name: 'Standard Payment Schedule',
      description: 'Default fallback schedule (3 installments)',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      installments: [
        {
          id: 'installment-1',
          scheduleId: 'default-fallback',
          installmentNumber: 1,
          percentage: 40,
          daysAfterTransaction: 7,
          description: 'Initial payment'
        },
        {
          id: 'installment-2',
          scheduleId: 'default-fallback',
          installmentNumber: 2,
          percentage: 30,
          daysAfterTransaction: 30,
          description: 'Second payment'
        },
        {
          id: 'installment-3',
          scheduleId: 'default-fallback',
          installmentNumber: 3,
          percentage: 30,
          daysAfterTransaction: 60,
          description: 'Final payment'
        }
      ]
    };
    
    // Return the fallback schedule in an array
    return [fallbackSchedule];
  };
  
  // Get default payment schedule
  const defaultPaymentSchedule = paymentSchedules?.find(schedule => schedule.isDefault) || 
    (paymentSchedules && paymentSchedules.length > 0 ? paymentSchedules[0] : null);
  
  // Create a new payment schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<PaymentSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
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
      } catch (err) {
        console.error('Error creating payment schedule:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to create payment schedule');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Payment schedule created successfully');
    },
    onError: (error: Error) => {
      console.error('Error creating payment schedule:', error);
      toast.error(`Failed to create payment schedule: ${error.message}`);
    }
  });

  return {
    paymentSchedules: paymentSchedules || getFallbackSchedules(),
    defaultPaymentSchedule,
    isLoading,
    error,
    createSchedule: createScheduleMutation.mutate,
    isCreating: createScheduleMutation.isPending
  };
}
