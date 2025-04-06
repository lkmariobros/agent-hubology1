
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Hook for commission forecast calculations
 */
export function useForecastCalculation(agentId?: string) {
  // Fetch forecast summary data
  const { data: forecastSummary = [], isLoading: isLoadingSummary } = useQuery({
    queryKey: ['forecastSummary', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const { data, error } = await supabase.rpc('calculate_commission_forecast_totals');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!agentId
  });
  
  // Generate forecast projections
  const generateForecast = useMutation({
    mutationFn: async ({ 
      agentId, 
      months 
    }: { 
      agentId: string;
      months: number;
    }) => {
      const response = await supabase.functions.invoke('generate_commission_forecast', {
        body: { agentId, months }
      });
      
      if (response.error) throw new Error(response.error.message || 'Failed to generate forecast');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Forecast regenerated successfully with ${data?.count || 0} projections`);
    },
    onError: (error: Error) => {
      toast.error(`Error generating forecast: ${error.message}`);
    }
  });
  
  return {
    forecastSummary,
    isLoadingSummary,
    generateForecast
  };
}
