
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface CommissionForecastChartProps {
  forecastData: {
    month: string;
    total_amount: number;
    scheduled_count: number;
  }[];
}

const CommissionForecastChart: React.FC<CommissionForecastChartProps> = ({ forecastData }) => {
  // Define custom colors for the chart bars
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', 
    '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ];

  if (!forecastData || forecastData.length === 0) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-center">No forecast data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Commission Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={forecastData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={70}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Projected Commission']}
              />
              <Bar dataKey="total_amount" name="Projected Commission">
                {forecastData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionForecastChart;
