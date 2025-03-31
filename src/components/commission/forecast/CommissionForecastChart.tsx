
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCommissionForecast } from '@/hooks/useCommissionForecast';
import useAuth from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { ForecastPeriod } from '@/types/commission';

interface CommissionForecastChartProps {
  agentId?: string;
  months?: number;
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({ 
  agentId,
  months = 6
}) => {
  const { user } = useAuth();
  const { useAgentForecast } = useCommissionForecast();
  
  // If no agentId is provided, use the current user's ID
  const targetAgentId = agentId || user?.id;
  
  const { data: forecastData, isLoading, error } = useAgentForecast(targetAgentId, months);

  // Format month for display
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  // Format chart data
  const formatChartData = (periods: ForecastPeriod[]) => {
    return periods.map(period => ({
      month: formatMonth(period.month),
      Confirmed: period.confirmedAmount,
      Pending: period.pendingAmount,
    }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-3 shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {formatCurrency(item.value)}
            </p>
          ))}
          <p className="font-medium">
            Total: {formatCurrency((payload[0]?.value || 0) + (payload[1]?.value || 0))}
          </p>
        </div>
      );
    }
    return null;
  };

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

  if (error || !forecastData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Failed to load forecast data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Expected</span>
            <span className="text-xl font-bold">
              {formatCurrency(forecastData.totalExpected)}
            </span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatChartData(forecastData.periods)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Confirmed" stackId="a" fill="#16a34a" />
              <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
