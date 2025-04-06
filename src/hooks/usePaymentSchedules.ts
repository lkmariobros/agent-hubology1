
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule } from '@/types/commission';

export function usePaymentSchedules() {
  const getPaymentSchedules = useQuery({
    queryKey: ['paymentSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_payment_schedules')
        .select(`
          id,
          name,
          description,
          is_default,
          created_at,
          updated_at,
          schedule_installments (
            id,
            schedule_id,
            installment_number,
            percentage,
            days_after_transaction,
            description
          )
        `)
        .order('name');
      
      if (error) throw error;
      
      // Transform to match our frontend type
      const schedules: PaymentSchedule[] = data.map(schedule => ({
        id: schedule.id,
        name: schedule.name,
        description: schedule.description,
        isDefault: schedule.is_default,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at,
        installments: schedule.schedule_installments.map((installment: any) => ({
          id: installment.id,
          scheduleId: installment.schedule_id,
          installmentNumber: installment.installment_number,
          percentage: installment.percentage,
          daysAfterTransaction: installment.days_after_transaction,
          description: installment.description
        }))
      }));
      
      return schedules;
    }
  });

  const getDefaultPaymentSchedule = useQuery({
    queryKey: ['defaultPaymentSchedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_payment_schedules')
        .select(`
          id,
          name,
          description,
          is_default,
          created_at,
          updated_at,
          schedule_installments (
            id,
            schedule_id,
            installment_number,
            percentage,
            days_after_transaction,
            description
          )
        `)
        .eq('is_default', true)
        .single();
      
      if (error) throw error;
      
      // Transform to match our frontend type
      const schedule: PaymentSchedule = {
        id: data.id,
        name: data.name,
        description: data.description,
        isDefault: data.is_default,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        installments: data.schedule_installments.map((installment: any) => ({
          id: installment.id,
          scheduleId: installment.schedule_id,
          installmentNumber: installment.installment_number,
          percentage: installment.percentage,
          daysAfterTransaction: installment.days_after_transaction,
          description: installment.description
        }))
      };
      
      return schedule;
    }
  });

  // Return wrapper object with the expected properties
  return {
    getPaymentSchedules,
    getDefaultPaymentSchedule,
    // Add these computed properties to match what components expect
    paymentSchedules: getPaymentSchedules.data || [],
    defaultPaymentSchedule: getDefaultPaymentSchedule.data,
    isLoading: getPaymentSchedules.isLoading || getDefaultPaymentSchedule.isLoading,
    error: getPaymentSchedules.error || getDefaultPaymentSchedule.error
  };
}
