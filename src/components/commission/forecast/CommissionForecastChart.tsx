
import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface CommissionForecastChartProps {
  historicalData: { month: string; amount: number }[];
  projectedData: { month: string; amount: number }[];
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({
  historicalData,
  projectedData,
}) => {
  // Combine historical and projected data
  const combinedData = useMemo(() => {
    const combined = [...historicalData];
    
    // Add projected data with a different key
    projectedData.forEach((item) => {
      const existingIndex = combined.findIndex((c) => c.month === item.month);
      if (existingIndex >= 0) {
        combined[existingIndex].projected = item.amount;
      } else {
        combined.push({
          month: item.month,
          projected: item.amount,
        });
      }
    });
    
    return combined;
  }, [historicalData, projectedData]);
  
  // Format for tooltip
  const formatTooltip = (value: number) => {
    return formatCurrency(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Commission Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={combinedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={formatTooltip}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              name="Actual"
              activeDot={{ r: 8 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#82ca9d"
              name="Projected"
              strokeDasharray="5 5"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
