
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CommissionInstallment, CommissionForecast } from '@/types/commission';
import { format, parseISO, addMonths, startOfMonth } from 'date-fns';
import { toast } from 'sonner';

interface ForecastResponse {
  installments: any[];
  month_totals: {
    month: string;
    total_amount: number;
  }[];
}

export function useForecastData(months: number = 12) {
  return useQuery({
    queryKey: ['commission', 'forecast', months],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate_commission_forecast', {
        body: { months }
      });

      if (error) {
        console.error('Error fetching forecast data:', error);
        throw new Error('Failed to fetch forecast data');
      }

      // Process the response into the expected format
      const response = data as ForecastResponse;

      const installmentsByMonth: Record<string, CommissionInstallment[]> = {};
      const installments = response.installments.map((item: any) => {
        // Convert snake_case to camelCase
        return {
          id: item.id,
          transactionId: item.transaction_id,
          installmentNumber: item.installment_number,
          agentId: item.agent_id,
          amount: item.amount,
          percentage: item.percentage,
          scheduledDate: item.scheduled_date,
          actualPaymentDate: item.actual_payment_date,
          status: item.status || 'Projected',
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          // Include any transaction/property data if available
          transaction: item.transaction
        } as CommissionInstallment;
      });

      // Group the installments by month
      installments.forEach(installment => {
        const monthKey = format(parseISO(installment.scheduledDate), 'yyyy-MM');
        
        if (!installmentsByMonth[monthKey]) {
          installmentsByMonth[monthKey] = [];
        }
        
        installmentsByMonth[monthKey].push(installment);
      });

      // Create the forecast data with monthly totals
      const forecast: CommissionForecast[] = response.month_totals.map(monthTotal => {
        const monthKey = monthTotal.month;
        return {
          month: monthKey,
          totalAmount: monthTotal.total_amount,
          installments: installmentsByMonth[monthKey] || []
        };
      });

      return forecast;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useForecastRefresh() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate_commission_forecast', {
        body: { refresh: true }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Commission forecast data refreshed');
    },
    onError: (error) => {
      console.error('Error refreshing forecast data:', error);
      toast.error('Failed to refresh forecast data');
    }
  });
}

export function useMonthlyForecastData() {
  // Get data for the next 12 months
  const currentDate = new Date();
  const months: { label: string; value: string }[] = [];

  for (let i = 0; i < 12; i++) {
    const date = addMonths(currentDate, i);
    const monthStart = startOfMonth(date);
    
    months.push({
      label: format(monthStart, 'MMMM yyyy'),
      value: format(monthStart, 'yyyy-MM')
    });
  }

  return months;
}
