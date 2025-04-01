
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CommissionForecast } from '@/types/commission';

export function useForecastCalculation(agentId?: string) {
  const queryClient = useQueryClient();

  // Generate forecast for an agent
  const generateForecast = useMutation({
    mutationFn: async ({ agentId, months = 12 }: { agentId: string; months?: number }) => {
      const response = await supabase.functions.invoke('generate_commission_forecast', {
        body: { agentId, months }
      });
      
      if (response.error) throw new Error(response.error.message || 'Failed to generate forecast');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionForecast'] });
      queryClient.invalidateQueries({ queryKey: ['forecastProjections', agentId] });
      toast.success('Commission forecast generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error generating forecast: ${error.message}`);
    }
  });

  // Get forecast summary
  const { data: forecastSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['commissionForecast'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_commission_forecast_totals');
      
      if (error) throw error;
      return data as { month: string; total_amount: number; scheduled_count: number }[];
    }
  });

  // Get forecast projections for an agent
  const { data: forecastProjections, isLoading: isLoadingProjections } = useQuery({
    queryKey: ['forecastProjections', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const { data, error } = await supabase
        .from('forecast_projections')
        .select('*')
        .eq('agent_id', agentId)
        .order('scheduled_date');
      
      if (error) throw error;
      return data;
    },
    enabled: !!agentId
  });

  // Get commission forecast by month
  const { data: forecastByMonth, isLoading: isLoadingForecastByMonth } = useQuery({
    queryKey: ['commissionForecastByMonth', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      
      // Get actual installments
      const { data: actualInstallments, error: actualError } = await supabase
        .from('commission_installments')
        .select(`
          id,
          transaction_id,
          installment_number,
          agent_id,
          amount,
          percentage,
          scheduled_date,
          status,
          actual_payment_date,
          notes,
          created_at,
          updated_at
        `)
        .eq('agent_id', agentId)
        .gte('scheduled_date', today.toISOString().split('T')[0])
        .lt('scheduled_date', nextYear.toISOString().split('T')[0])
        .in('status', ['Pending', 'Processing']);
      
      if (actualError) throw actualError;
      
      // Get projected installments
      const { data: projectedInstallments, error: projectedError } = await supabase
        .from('forecast_projections')
        .select(`
          id,
          projected_transaction_id as transaction_id,
          installment_number,
          agent_id,
          amount,
          percentage,
          scheduled_date,
          status,
          null as actual_payment_date,
          null as notes,
          created_at,
          updated_at
        `)
        .eq('agent_id', agentId)
        .gte('scheduled_date', today.toISOString().split('T')[0])
        .lt('scheduled_date', nextYear.toISOString().split('T')[0]);
      
      if (projectedError) throw projectedError;
      
      // Combine and group by month
      const allInstallments = [...(actualInstallments || []), ...(projectedInstallments || [])];
      const groupedByMonth: { [key: string]: CommissionForecast } = {};
      
      allInstallments.forEach(installment => {
        // Extract month from scheduled_date (YYYY-MM)
        const dateObj = new Date(installment.scheduled_date);
        const monthKey = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = {
            month: monthKey,
            totalAmount: 0,
            installments: []
          };
        }
        
        groupedByMonth[monthKey].totalAmount += Number(installment.amount);
        groupedByMonth[monthKey].installments.push(installment as any);
      });
      
      // Convert to array and sort by date
      return Object.values(groupedByMonth).sort((a, b) => {
        const dateA = new Date(a.installments[0].scheduled_date);
        const dateB = new Date(b.installments[0].scheduled_date);
        return dateA.getTime() - dateB.getTime();
      });
    },
    enabled: !!agentId
  });
  
  return {
    generateForecast,
    forecastSummary,
    forecastProjections,
    forecastByMonth,
    isLoadingSummary,
    isLoadingProjections,
    isLoadingForecastByMonth
  };
}
