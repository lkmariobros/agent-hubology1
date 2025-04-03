
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentSchedule } from '@/types/commission';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { formatCurrency } from '@/utils/commissionSchedule';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentScheduleSelectorProps {
  value: string;
  onChange: (scheduleId: string) => void;
  commissionAmount: number;
}

const PaymentScheduleSelector: React.FC<PaymentScheduleSelectorProps> = ({ 
  value, 
  onChange,
  commissionAmount 
}) => {
  const { paymentSchedules, isLoading, error } = usePaymentSchedules();
  
  // If no value is selected but we have schedules, default to the default schedule
  React.useEffect(() => {
    if (!value && paymentSchedules && paymentSchedules.length > 0) {
      const defaultSchedule = paymentSchedules.find(schedule => schedule.isDefault);
      if (defaultSchedule && onChange) {
        onChange(defaultSchedule.id);
      }
    }
  }, [value, paymentSchedules, onChange]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading payment schedules: {error.message || 'Please try refreshing the page'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!paymentSchedules || paymentSchedules.length === 0) {
    return (
      <Card className="p-4">
        <CardContent className="pt-4">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No payment schedules available</p>
            <p className="text-sm text-muted-foreground mt-2">Please contact an administrator to create one</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const selectedSchedule = paymentSchedules.find(schedule => schedule.id === value);
  
  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a payment schedule" />
        </SelectTrigger>
        <SelectContent>
          {paymentSchedules.map((schedule) => (
            <SelectItem key={schedule.id} value={schedule.id}>
              {schedule.name}
              {schedule.isDefault && (
                <Badge className="ml-2" variant="outline">Default</Badge>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedSchedule && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">{selectedSchedule.name}</CardTitle>
            {selectedSchedule.description && (
              <CardDescription>{selectedSchedule.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedSchedule.installments.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">No installments defined for this schedule</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSchedule.installments
                  .sort((a, b) => a.installmentNumber - b.installmentNumber)
                  .map((installment) => (
                    <div key={installment.id} className="flex justify-between items-center p-2 bg-secondary/30 rounded">
                      <div>
                        <p className="font-medium">Installment {installment.installmentNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {installment.daysAfterTransaction} days after transaction
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency((commissionAmount * installment.percentage) / 100)}
                        </p>
                        <p className="text-xs text-muted-foreground">{installment.percentage}%</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentScheduleSelector;
