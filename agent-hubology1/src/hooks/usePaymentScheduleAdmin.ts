
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { toast } from 'sonner';

export const usePaymentScheduleAdmin = () => {
  const queryClient = useQueryClient();
  
  // Fetch all payment schedules
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['paymentSchedules'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('commission_payment_schedules')
          .select('*, installments:schedule_installments(*)');
          
        if (error) throw error;
        
        // Transform the data to match our interface
        return data.map(schedule => ({
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
      } catch (err) {
        console.error('Error fetching payment schedules:', err);
        throw err;
      }
    }
  });
  
  // Create payment schedule mutation
  const createPaymentSchedule = useMutation({
    mutationFn: async (schedule: {
      name: string;
      description?: string;
      installments: Partial<ScheduleInstallment>[];
    }) => {
      // First create the schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .insert({
          name: schedule.name,
          description: schedule.description,
          is_default: false
        })
        .select();
      
      if (scheduleError) throw scheduleError;
      
      const scheduleId = scheduleData[0].id;
      
      // Then create the installments
      const installmentsWithScheduleId = schedule.installments.map(installment => ({
        schedule_id: scheduleId,
        installment_number: installment.installmentNumber,
        percentage: installment.percentage,
        days_after_transaction: installment.daysAfterTransaction,
        description: installment.description
      }));
      
      const { error: installmentsError } = await supabase
        .from('schedule_installments')
        .insert(installmentsWithScheduleId);
      
      if (installmentsError) throw installmentsError;
      
      return scheduleData[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Payment schedule created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating payment schedule: ${error.message}`);
    }
  });
  
  // Update payment schedule mutation
  const updatePaymentSchedule = useMutation({
    mutationFn: async ({
      scheduleId,
      schedule
    }: {
      scheduleId: string;
      schedule: {
        name: string;
        description?: string;
        installments: Partial<ScheduleInstallment>[];
      };
    }) => {
      // Update the schedule
      const { error: scheduleError } = await supabase
        .from('commission_payment_schedules')
        .update({
          name: schedule.name,
          description: schedule.description
        })
        .eq('id', scheduleId);
      
      if (scheduleError) throw scheduleError;
      
      // Delete existing installments
      const { error: deleteError } = await supabase
        .from('schedule_installments')
        .delete()
        .eq('schedule_id', scheduleId);
      
      if (deleteError) throw deleteError;
      
      // Create new installments
      const installmentsWithScheduleId = schedule.installments.map(installment => ({
        schedule_id: scheduleId,
        installment_number: installment.installmentNumber,
        percentage: installment.percentage,
        days_after_transaction: installment.daysAfterTransaction,
        description: installment.description
      }));
      
      const { error: installmentsError } = await supabase
        .from('schedule_installments')
        .insert(installmentsWithScheduleId);
      
      if (installmentsError) throw installmentsError;
      
      return { id: scheduleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Payment schedule updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating payment schedule: ${error.message}`);
    }
  });
  
  // Delete payment schedule mutation
  const deletePaymentSchedule = useMutation({
    mutationFn: async (scheduleId: string) => {
      // Check if the schedule is default
      const schedule = schedules?.find(s => s.id === scheduleId);
      if (schedule?.isDefault) {
        throw new Error("Cannot delete the default payment schedule");
      }
      
      const { error } = await supabase
        .from('commission_payment_schedules')
        .delete()
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      return { id: scheduleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Payment schedule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting payment schedule: ${error.message}`);
    }
  });
  
  // Set default schedule mutation
  const setDefaultSchedule = useMutation({
    mutationFn: async (scheduleId: string) => {
      // First unset all default schedules
      const { error: unsetError } = await supabase
        .from('commission_payment_schedules')
        .update({ is_default: false })
        .neq('id', scheduleId);
      
      if (unsetError) throw unsetError;
      
      // Then set the new default schedule
      const { error } = await supabase
        .from('commission_payment_schedules')
        .update({ is_default: true })
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      return { id: scheduleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['payment-schedules'] });
      toast.success('Default payment schedule updated');
    },
    onError: (error: any) => {
      toast.error(`Error setting default schedule: ${error.message}`);
    }
  });
  
  return {
    schedules,
    isLoading,
    error,
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    setDefaultSchedule
  };
};
