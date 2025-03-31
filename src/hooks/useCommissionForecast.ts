
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CommissionForecast {
  months: MonthlyForecast[];
  total: number;
}

export interface MonthlyForecast {
  month: string;
  amount: number;
}

export interface ForecastSettings {
  installmentCount: number;
  paymentCutoffDay: number;
  firstPaymentDelay: number;
}

export const useFetchCommissionForecast = (agentId?: string, months: number = 6) => {
  return useQuery({
    queryKey: ['commission-forecast', agentId, months],
    queryFn: async (): Promise<CommissionForecast> => {
      if (!agentId) {
        throw new Error('Agent ID is required to fetch commission forecast');
      }

      const { data, error } = await supabase.functions.invoke('get_commission_forecast', {
        body: { agentId, months }
      });

      if (error) {
        console.error('Error fetching commission forecast:', error);
        throw new Error(error.message || 'Failed to fetch commission forecast');
      }

      return data;
    },
    enabled: !!agentId
  });
};

export const useForecastSettings = () => {
  return useQuery({
    queryKey: ['forecast-settings'],
    queryFn: async (): Promise<ForecastSettings> => {
      // This would normally get data from Supabase but for now return default values
      return {
        installmentCount: 3,
        paymentCutoffDay: 15,
        firstPaymentDelay: 30
      };
    }
  });
};

export const useUpdateForecastSettingsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: ForecastSettings) => {
      // This would normally update data in Supabase
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forecast-settings'] });
      toast.success('Forecast settings updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update forecast settings', {
        description: error.message
      });
    }
  });
};

// Create a useCommissionForecast hook that returns all the forecast-related hooks
export const useCommissionForecast = () => {
  return {
    useFetchCommissionForecast,
    useForecastSettings,
    useUpdateForecastSettingsMutation
  };
};

// Export a default object with all hooks for easier importing
export default useCommissionForecast;
