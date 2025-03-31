
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFetchCommissionForecast } from '@/hooks/useCommissionForecast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface CommissionForecastChartProps {
  agentId?: string;
  months?: number;
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({
  agentId,
  months = 6
}) => {
  const { data: forecast, isLoading, error } = useFetchCommissionForecast(agentId, months);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            Failed to load forecast data.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = forecast.periods.map(period => ({
    name: period.month.split('-')[1], // Just show the month part from 'YYYY-MM'
    Expected: period.expectedAmount,
    Confirmed: period.confirmedAmount,
    Pending: period.pendingAmount,
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Commission Forecast</span>
          <span className="text-sm font-normal text-muted-foreground">
            6 Month Total: {formatCurrency(forecast.totalExpected)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Confirmed" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
              />
              <Area 
                type="monotone" 
                dataKey="Pending" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b" 
              />
              <Area 
                type="monotone" 
                dataKey="Expected" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
