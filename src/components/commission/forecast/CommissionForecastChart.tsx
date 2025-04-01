
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useCommissionForecast } from '@/hooks/useCommissionForecast';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

interface CommissionForecastChartProps {
  months?: number;
  userId?: string;
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({ 
  months = 6,
  userId
}) => {
  const { user } = useAuth();
  const forecastHooks = useCommissionForecast();
  const { data: forecast, isLoading } = forecastHooks.useFetchCommissionForecast(userId || user?.id, months);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading forecast data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!forecast || !forecast.months || forecast.months.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No forecast data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Transform data for charting
  const chartData = forecast.months.map(month => ({
    name: month.month,
    amount: month.amount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, 0)}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="amount" 
                fill="currentColor" 
                className="fill-primary" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Forecast Total
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(forecast.total)}
            </p>
          </div>
          <div className="text-sm text-right">
            <p className="text-muted-foreground">Next {months} months</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
