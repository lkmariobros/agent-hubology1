
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CommissionForecastSettings, CommissionForecast, ForecastPeriod } from '@/types/commission';

/**
 * Hook for managing commission forecasting
 */
const useCommissionForecast = () => {
  const queryClient = useQueryClient();

  /**
   * Get the forecast settings
   */
  const useForecastSettings = (agencyId?: string) => {
    return useQuery({
      queryKey: ['forecast-settings', agencyId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('commission_forecast_settings')
          .select('*')
          .eq('agency_id', agencyId || '11111111-1111-1111-1111-111111111111')
          .eq('active', true)
          .single();

        if (error) {
          // If no settings found, return system defaults
          if (error.code === 'PGRST116') {
            const { data: configs } = await supabase
              .from('system_configuration')
              .select('key, value')
              .in('key', ['payment_cutoff_day', 'default_installment_count', 'default_installment_amounts', 'forecast_horizon_months']);

            if (configs) {
              const settings: Partial<CommissionForecastSettings> = {
                payment_cutoff_day: parseInt(configs.find(c => c.key === 'payment_cutoff_day')?.value || '26'),
                default_installment_count: parseInt(configs.find(c => c.key === 'default_installment_count')?.value || '4'),
                default_installment_amounts: JSON.parse(configs.find(c => c.key === 'default_installment_amounts')?.value || '[]'),
                forecast_horizon_months: parseInt(configs.find(c => c.key === 'forecast_horizon_months')?.value || '6')
              };
              return settings as CommissionForecastSettings;
            }
          }
          throw error;
        }
        return data as CommissionForecastSettings;
      }
    });
  };

  /**
   * Update forecast settings
   */
  const useUpdateForecastSettingsMutation = () => {
    return useMutation({
      mutationFn: async (settings: Partial<CommissionForecastSettings> & { agency_id: string }) => {
        const { data, error } = await supabase
          .from('commission_forecast_settings')
          .upsert({
            ...settings,
            updated_at: new Date().toISOString(),
            created_by: supabase.auth.getUser().then(res => res.data.user?.id)
          })
          .select();

        if (error) throw error;
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['forecast-settings', variables.agency_id] });
        toast.success('Forecast settings updated');
      },
      onError: (error: Error) => {
        toast.error('Failed to update forecast settings', {
          description: error.message
        });
      }
    });
  };

  /**
   * Get commission forecast data for an agent
   */
  const useAgentForecast = (agentId?: string, months: number = 6) => {
    return useQuery({
      queryKey: ['commission-forecast', 'agent', agentId, months],
      queryFn: async () => {
        // In a production environment, this would call an edge function
        // For demo purposes, we'll generate mock forecast data
        const { data: schedules, error } = await supabase
          .from('commission_payment_schedules')
          .select(`
            *,
            commission_installments(*)
          `)
          .eq('agent_id', agentId)
          .eq('status', 'Active');

        if (error) throw error;

        // Generate forecast periods (current month + next X months)
        const periods: ForecastPeriod[] = [];
        const today = new Date();
        
        for (let i = 0; i < months; i++) {
          const forecastDate = new Date(today);
          forecastDate.setMonth(today.getMonth() + i);
          
          const monthKey = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
          
          periods.push({
            month: monthKey,
            expectedAmount: 0,
            confirmedAmount: 0,
            pendingAmount: 0
          });
        }

        // Calculate expected amounts for each period based on installments
        let totalExpected = 0;

        if (schedules) {
          schedules.forEach(schedule => {
            if (schedule.commission_installments) {
              schedule.commission_installments.forEach(installment => {
                const dueDate = new Date(installment.due_date);
                const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
                
                const periodIndex = periods.findIndex(p => p.month === monthKey);
                if (periodIndex >= 0) {
                  totalExpected += installment.amount;
                  
                  if (installment.status === 'Paid') {
                    periods[periodIndex].confirmedAmount += installment.amount;
                  } else {
                    periods[periodIndex].pendingAmount += installment.amount;
                  }
                  
                  periods[periodIndex].expectedAmount += installment.amount;
                }
              });
            }
          });
        }

        const forecast: CommissionForecast = {
          totalExpected,
          periods
        };

        return forecast;
      },
      enabled: !!agentId
    });
  };

  return {
    useForecastSettings,
    useUpdateForecastSettingsMutation,
    useAgentForecast
  };
};

export default useCommissionForecast;
