
import React from 'react';
import { format, parseISO } from 'date-fns';
import { useCommissionForecast } from '@/hooks/useUpcomingPayments';
import { groupInstallmentsByMonth, getStatusBadgeClasses } from '@/utils/paymentScheduleUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Loader2, CalendarIcon, HomeIcon } from 'lucide-react';

const CommissionForecast: React.FC = () => {
  const { data: installments, isLoading } = useCommissionForecast();
  
  // Group installments by month
  const forecastByMonth = installments ? groupInstallmentsByMonth(installments) : [];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!installments || installments.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Commission Forecast</h1>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-48">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No upcoming commission payments found</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Commission Forecast</h1>
      
      {forecastByMonth.map((month, index) => (
        <Card key={index} className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{month.month}</CardTitle>
              <div className="text-2xl font-semibold">{formatCurrency(month.totalAmount)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {month.installments.map((installment) => (
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
    </div>
  );
};

export default CommissionForecast;
