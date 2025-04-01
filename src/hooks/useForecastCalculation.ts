
import { useState } from 'react';
import { CommissionForecast } from '@/types';
import { supabase } from '@/lib/supabase';

export const useForecastCalculation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const calculateForecast = async (agentId: string, months: number): Promise<CommissionForecast[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from an API endpoint
      // or call an Edge Function to calculate the forecast
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          id,
          amount,
          percentage,
          scheduled_date,
          status
        `)
        .eq('agent_id', agentId)
        .gte('scheduled_date', new Date(new Date().setDate(1)).toISOString())
        .lte('scheduled_date', new Date(new Date().setMonth(new Date().getMonth() + months)).toISOString())
        .order('scheduled_date', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      // Group by month
      const forecastByMonth: { [key: string]: CommissionForecast } = {};
      
      data.forEach((installment) => {
        const date = new Date(installment.scheduled_date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!forecastByMonth[month]) {
          forecastByMonth[month] = {
            month,
            totalAmount: 0,
            installments: []
          };
        }
        
        forecastByMonth[month].totalAmount += installment.amount;
        forecastByMonth[month].installments.push({
          id: installment.id,
          transactionId: '',
          installmentNumber: 0,
          agentId,
          amount: installment.amount,
          percentage: installment.percentage,
          scheduledDate: installment.scheduled_date,
          status: installment.status,
          createdAt: '',
          updatedAt: ''
        });
      });
      
      // Convert to array and sort by month
      const forecast = Object.values(forecastByMonth).sort((a, b) => 
        a.month.localeCompare(b.month)
      );
      
      return forecast;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return { calculateForecast, isLoading, error };
};

export default useForecastCalculation;
