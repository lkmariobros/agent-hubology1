
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CommissionForecast } from '@/types/commission';

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

// Export a default object with all hooks for easier importing
const useCommissionForecast = {
  useFetchCommissionForecast
};

export default useCommissionForecast;
