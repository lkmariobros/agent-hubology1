import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface ForecastData {
  month: string;
  forecastedCommission: number;
}

interface CommissionForecastChartProps {
  months?: number;
  userId?: string;
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({ 
  months = 6,
  userId
}) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  
  const useForecast = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['commission-forecast', userId, months],
      queryFn: async () => {
        if (!userId) return [];
        
        const endDate = new Date();
        const startDate = subMonths(endDate, months - 1);
        
        const { data, error } = await supabase.functions.invoke('commission-forecast', {
          body: {
            user_id: userId,
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd')
          }
        });
        
        if (error) {
          console.error('Error fetching commission forecast:', error);
          return [];
        }
        
        return data as ForecastData[];
      },
      enabled: !!userId,
    });
  };
  
  const { data: forecastData, isLoading } = useForecast(userId);

  useEffect(() => {
    if (forecastData) {
      setForecastData(forecastData);
    }
  }, [forecastData]);

  const formatTick = (value: string) => {
    return format(new Date(value), 'MMM');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                tickFormatter={formatTick}
                stroke="#8884d8"
              />
              <YAxis 
                stroke="#8884d8"
                tickFormatter={(value) => `$${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => [`$${value}`, 'Forecasted Commission']} />
              <Area 
                type="monotone" 
                dataKey="forecastedCommission" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#commissionGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
