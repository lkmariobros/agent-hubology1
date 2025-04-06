
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { toast } from 'sonner';

/**
 * Hook to fetch and manage payment schedules
 */
export function usePaymentSchedules() {
  const getPaymentSchedules = useQuery({
    queryKey: ['paymentSchedules'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('commission_payment_schedules')
          .select('*, installments:schedule_installments(*)');
        
        if (error) throw error;
        
        // Transform the data to match our interface
        const schedules = data.map((schedule: any) => ({
          id: schedule.id,
          name: schedule.name,
          description: schedule.description,
          isDefault: schedule.is_default,
          createdAt: schedule.created_at,
          updatedAt: schedule.updated_at,
          installments: schedule.installments.map((inst: any) => ({
            id: inst.id,
            scheduleId: inst.schedule_id,
            installmentNumber: inst.installment_number,
            percentage: inst.percentage,
            daysAfterTransaction: inst.days_after_transaction,
            description: inst.description
          }))
        })) as PaymentSchedule[];
        
        return schedules;
      } catch (error) {
        console.error('Error fetching payment schedules:', error);
        toast.error('Failed to load payment schedules');
        return [] as PaymentSchedule[];
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const getDefaultPaymentSchedule = useQuery({
    queryKey: ['defaultPaymentSchedule'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('commission_payment_schedules')
          .select('*, installments:schedule_installments(*)')
          .eq('is_default', true)
          .single();
        
        if (error) throw error;
        
        // Transform to match our interface
        const schedule: PaymentSchedule = {
          id: data.id,
          name: data.name,
          description: data.description,
          isDefault: data.is_default,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          installments: data.installments.map((inst: any) => ({
            id: inst.id,
            scheduleId: inst.schedule_id,
            installmentNumber: inst.installment_number,
            percentage: inst.percentage,
            daysAfterTransaction: inst.days_after_transaction,
            description: inst.description
          }))
        };
        
        return schedule;
      } catch (error) {
        console.error('Error fetching default payment schedule:', error);
        // Return a basic default schedule if error
        return {
          id: 'default',
          name: 'Standard Schedule',
          isDefault: true,
          installments: [
            {
              id: 'default-1',
              scheduleId: 'default',
              installmentNumber: 1,
              percentage: 100,
              daysAfterTransaction: 30,
              description: 'Full payment'
            }
          ]
        } as PaymentSchedule;
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Correctly expose all the required properties
  const paymentSchedules = getPaymentSchedules.data || [];
  const defaultPaymentSchedule = getDefaultPaymentSchedule.data;
  const isLoading = getPaymentSchedules.isLoading || getDefaultPaymentSchedule.isLoading;
  const error = getPaymentSchedules.error || getDefaultPaymentSchedule.error;

  return {
    getPaymentSchedules,
    getDefaultPaymentSchedule,
    paymentSchedules,
    defaultPaymentSchedule,
    isLoading,
    error
  };
}
