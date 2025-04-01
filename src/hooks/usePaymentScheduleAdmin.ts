
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { toast } from 'sonner';

export const usePaymentScheduleAdmin = () => {
  const queryClient = useQueryClient();
  
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
        ...installment,
        schedule_id: scheduleId
      }));
      
      const { error: installmentsError } = await supabase
        .from('schedule_installments')
        .insert(installmentsWithScheduleId);
      
      if (installmentsError) throw installmentsError;
      
      return scheduleData[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success('Payment schedule created successfully');
    },
    onError: (error) => {
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
        ...installment,
        schedule_id: scheduleId
      }));
      
      const { error: installmentsError } = await supabase
        .from('schedule_installments')
        .insert(installmentsWithScheduleId);
      
      if (installmentsError) throw installmentsError;
      
      return { id: scheduleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success('Payment schedule updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating payment schedule: ${error.message}`);
    }
  });
  
  // Delete payment schedule mutation
  const deletePaymentSchedule = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from('commission_payment_schedules')
        .delete()
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      return { id: scheduleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success('Payment schedule deleted successfully');
    },
    onError: (error) => {
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
      toast.success('Default payment schedule updated');
    },
    onError: (error) => {
      toast.error(`Error setting default schedule: ${error.message}`);
    }
  });
  
  // Generate installments for a transaction
  const generateInstallments = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/generate_commission_installments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ transactionId })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate installments');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionInstallments'] });
      toast.success('Commission installments generated successfully');
    },
    onError: (error) => {
      toast.error(`Error generating installments: ${error.message}`);
    }
  });
  
  return {
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    setDefaultSchedule,
    generateInstallments
  };
};
