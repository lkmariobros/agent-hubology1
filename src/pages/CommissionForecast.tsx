
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CommissionForecast = () => {
  // Sample forecast data
  const forecastData = [
    { month: 'April', projected: 15000 },
    { month: 'May', projected: 18500 },
    { month: 'June', projected: 22000 },
    { month: 'July', projected: 19500 },
    { month: 'August', projected: 25000 },
    { month: 'September', projected: 28000 },
    { month: 'October', projected: 32000 },
    { month: 'November', projected: 29000 },
    { month: 'December', projected: 35000 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commission Forecast</h1>
        <p className="text-muted-foreground">Projected commission earnings for the next 9 months</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={forecastData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Projected Commission']} />
                <Bar dataKey="projected" fill="#3b82f6" name="Projected Commission" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">90-Day Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$55,500</div>
            <p className="text-xs text-muted-foreground mt-1">Based on current pipeline and closing rates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Year-End Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$224,000</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated total for fiscal year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground mt-1">Of annual target ($350,000)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionForecast;
