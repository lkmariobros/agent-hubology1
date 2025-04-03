
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';
import { PaymentSchedule, ScheduleInstallment } from '@/types/commission';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentScheduleDetailProps {
  schedule?: PaymentSchedule;
  commissionAmount?: number;
  isLoading?: boolean;
}

const PaymentScheduleDetail: React.FC<PaymentScheduleDetailProps> = ({ 
  schedule,
  commissionAmount = 0,
  isLoading = false
}) => {
  // Calculate today's date for comparison
  const today = new Date();
  
  // Calculate expected dates based on a hypothetical transaction date (today)
  const getExpectedDate = (daysAfter: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAfter);
    return date;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-7 items-start">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!schedule) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg">No payment schedule selected</h3>
            <p className="text-muted-foreground mt-1">Please select a payment schedule to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Sort installments by number
  const sortedInstallments = [...(schedule.installments || [])].sort(
    (a, b) => a.installmentNumber - b.installmentNumber
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{schedule.name}</CardTitle>
            {schedule.description && (
              <CardDescription>{schedule.description}</CardDescription>
            )}
          </div>
          {schedule.isDefault && (
            <Badge variant="outline" className="ml-2">Default</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Total Commission:</h3>
            <span className="font-bold">{formatCurrency(commissionAmount)}</span>
          </div>
          
          {sortedInstallments.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No installments defined for this schedule</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 top-5 h-full w-0.5 bg-muted"></div>
              
              {/* Installments */}
              <div className="space-y-8">
                {sortedInstallments.map((installment) => {
                  const expectedDate = getExpectedDate(installment.daysAfterTransaction);
                  const isPast = isBefore(expectedDate, today);
                  const amount = (commissionAmount * installment.percentage) / 100;
                  
                  return (
                    <div key={installment.id} className="flex gap-7 items-start relative">
                      <div className={`mt-1 rounded-full p-1.5 ${isPast ? 'bg-gray-400' : 'bg-primary'}`}>
                        {isPast ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Installment {installment.installmentNumber}</h4>
                          <span className="font-bold">{formatCurrency(amount)}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{installment.percentage}% of total commission</p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(expectedDate, 'MMMM dd, yyyy')}
                            <span className="text-muted-foreground ml-1">
                              ({installment.daysAfterTransaction} days after transaction)
                            </span>
                          </span>
                        </div>
                        
                        {installment.description && (
                          <p className="text-sm mt-1">{installment.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleDetail;
