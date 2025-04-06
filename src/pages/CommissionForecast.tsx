
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useCommissionForecast } from '@/hooks/useUpcomingPayments';
import { useForecastCalculation } from '@/hooks/useForecastCalculation';
import { groupInstallmentsByMonth, getStatusBadgeClasses } from '@/utils/paymentScheduleUtils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Loader2, CalendarIcon, HomeIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CommissionForecastChart from '@/components/commission/CommissionForecastChart';

const CommissionForecast: React.FC = () => {
  const { user } = useAuth();
  const { data: installments, isLoading } = useCommissionForecast();
  const { 
    generateForecast, 
    forecastSummary, 
    isLoadingSummary 
  } = useForecastCalculation(user?.id);
  
  const [activeTab, setActiveTab] = useState('forecast');
  
  // Group installments by month - make sure we're handling this as an object, not a function
  const forecastByMonth = installments ? groupInstallmentsByMonth(installments) : {};
  
  const handleRegenerateForecast = () => {
    if (user?.id) {
      generateForecast.mutate({ agentId: user.id, months: 12 });
    }
  };
  
  if (isLoading || isLoadingSummary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if ((!installments || installments.length === 0) && forecastSummary.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Commission Forecast</h1>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-48">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No upcoming commission payments found</p>
            <Button onClick={handleRegenerateForecast}>
              Generate Forecast
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Commission Forecast</h1>
        <Button onClick={handleRegenerateForecast} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerate Forecast
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="forecast">Forecast View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="mt-6">
          <CommissionForecastChart forecastData={forecastSummary} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {forecastSummary.slice(0, 4).map((month) => (
              <Card key={month.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{month.month}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{formatCurrency(month.total_amount)}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {month.scheduled_count} installments
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          {/* Ensure we're iterating through an array, not trying to call a function or access properties of a number */}
          {Object.entries(forecastByMonth).map(([monthKey, monthData], index) => (
            <Card key={monthKey} className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>{monthKey}</CardTitle>
                  <div className="text-2xl font-semibold">{formatCurrency(monthData.totalAmount)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthData.installments && monthData.installments.map((installment) => (
                    <div key={installment.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {installment.transaction?.property?.title || 'Unknown Property'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Installment {installment.installmentNumber} ({installment.percentage}%)
                          </p>
                        </div>
                        <Badge className={getStatusBadgeClasses(installment.status)}>
                          {installment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Amount</p>
                          <p className="font-semibold">{formatCurrency(installment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Scheduled Date</p>
                          <p className="font-semibold">
                            {format(parseISO(installment.scheduledDate), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Property</p>
                          <div className="flex items-center gap-1">
                            <HomeIcon className="w-4 h-4 text-muted-foreground" />
                            <p className="truncate">
                              {installment.transaction?.property?.title || 'Unknown Property'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionForecast;
