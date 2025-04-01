
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useForecastCalculation } from '@/hooks/useForecastCalculation';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';

const CommissionForecast: React.FC = () => {
  const { user } = useAuth();
  const agentId = user?.id;
  const [activeTab, setActiveTab] = useState('summary');
  
  const {
    generateForecast,
    forecastSummary,
    forecastByMonth,
    isLoadingSummary,
    isLoadingForecastByMonth
  } = useForecastCalculation(agentId);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', 
    '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ];

  const handleRegenerateForecast = () => {
    if (agentId) {
      generateForecast.mutate({ agentId, months: 12 });
    }
  };

  if (isLoadingSummary || isLoadingForecastByMonth || !agentId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Commission Forecast</h2>
          <p className="text-muted-foreground">
            Projected commission earnings for the next 12 months
          </p>
        </div>
        
        <Button 
          onClick={handleRegenerateForecast} 
          disabled={generateForecast.isPending}
          className="flex items-center gap-2"
        >
          {generateForecast.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Regenerate Forecast
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Monthly Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>12 Month Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={forecastSummary}
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
                      {forecastSummary?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecastSummary?.map((month, index) => (
              <Card key={month.month}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{month.month}</span>
                    <Badge className="ml-2">{month.scheduled_count} Installments</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(month.total_amount)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6 pt-4">
          {forecastByMonth?.map((monthData) => (
            <Card key={monthData.month}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{monthData.month}</span>
                  <div>
                    <Badge className="ml-2">{monthData.installments.length} Installments</Badge>
                    <span className="ml-4 font-bold">{formatCurrency(monthData.totalAmount)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Installment #</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.installments.map((installment) => (
                        <tr key={installment.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-2">
                            {new Date(installment.scheduledDate || installment.scheduled_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {installment.status === "Projected" ? 'Forecast' : 'Confirmed'}
                          </td>
                          <td className="px-4 py-2">
                            {installment.installmentNumber || installment.installment_number}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {formatCurrency(installment.amount)}
                          </td>
                          <td className="px-4 py-2">
                            <Badge 
                              variant={installment.status === "Projected" ? 'secondary' : 'default'}
                            >
                              {installment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!forecastByMonth || forecastByMonth.length === 0) && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No forecast data available</p>
              <Button 
                onClick={handleRegenerateForecast} 
                variant="outline" 
                className="mt-4"
              >
                Generate Forecast
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionForecast;
