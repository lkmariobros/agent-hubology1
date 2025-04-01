
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useMutation } from '@tanstack/react-query';

export interface CommissionForecast {
  id: string;
  month: string;
  total_amount: number;
  scheduled_count: number;
  installments: any[];
}

interface MonthlyForecastData {
  month: string;
  totalAmount: number;
  installments: any[];
}

export const useForecastCalculation = (agentId?: string) => {
  const [forecastSummary, setForecastSummary] = useState<CommissionForecast[]>([]);
  const [forecastByMonth, setForecastByMonth] = useState<MonthlyForecastData[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingForecastByMonth, setIsLoadingForecastByMonth] = useState(false);

  const generateForecast = useMutation({
    mutationFn: async ({ agentId, months }: { agentId: string, months: number }) => {
      setIsLoadingSummary(true);
      setIsLoadingForecastByMonth(true);
      
      try {
        // Mock data for now - in real app this would call an API
        const mockData = Array.from({ length: 6 }, (_, i) => ({
          id: `forecast-${i}`,
          month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'long', year: 'numeric' }),
          total_amount: Math.floor(Math.random() * 50000) + 5000,
          scheduled_count: Math.floor(Math.random() * 5) + 1,
          installments: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
            id: `installment-${i}-${j}`,
            installmentNumber: j + 1,
            amount: Math.floor(Math.random() * 10000) + 1000,
            scheduledDate: new Date(Date.now() + (i * 30 + j * 10) * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Projected'
          }))
        }));
        
        setForecastSummary(mockData);
        setForecastByMonth(mockData.map(month => ({
          month: month.month,
          totalAmount: month.total_amount,
          installments: month.installments
        })));
        
        return mockData;
      } finally {
        setIsLoadingSummary(false);
        setIsLoadingForecastByMonth(false);
      }
    }
  });

  return {
    generateForecast,
    forecastSummary,
    forecastByMonth,
    isLoadingSummary,
    isLoadingForecastByMonth
  };
};
