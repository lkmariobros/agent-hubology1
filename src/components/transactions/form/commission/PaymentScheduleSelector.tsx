
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentSchedule } from '@/types/commission';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { formatCurrency } from '@/utils/commissionSchedule';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  if (error || !paymentSchedules) {
    return (
      <Card className="p-4 border-destructive">
        <p className="text-destructive">Error loading payment schedules</p>
        <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
      </Card>
    );
  }
  
  // If no value is selected but we have schedules, default to the default schedule
  const defaultSchedule = paymentSchedules.find(schedule => schedule.isDefault);
  if (!value && defaultSchedule && onChange) {
    // Use setTimeout to avoid React state update during render
    setTimeout(() => onChange(defaultSchedule.id), 0);
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentScheduleSelector;
