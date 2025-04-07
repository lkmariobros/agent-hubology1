
import React, { useEffect } from 'react';
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
  const { paymentSchedules, defaultPaymentSchedule, isLoading, error } = usePaymentSchedules();
  
  useEffect(() => {
    if (paymentSchedules && paymentSchedules.length > 0 && defaultPaymentSchedule && !value) {
      console.log('Setting default payment schedule:', defaultPaymentSchedule.id);
      onChange(defaultPaymentSchedule.id);
    }
  }, [paymentSchedules, defaultPaymentSchedule, value, onChange]);
  
  useEffect(() => {
    // Log available data
    console.log('PaymentScheduleSelector data state:', { 
      paymentSchedules, 
      defaultPaymentSchedule,
      isLoading, 
      error, 
      currentValue: value 
    });
  }, [paymentSchedules, defaultPaymentSchedule, isLoading, error, value]);
  
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
  
  // Always check if we have payment schedules
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
  
  // If there was an error but we still have fallback schedules
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading payment schedules from database. Using fallback schedules instead.
          </AlertDescription>
        </Alert>
        
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
        
        {/* Show selected schedule details */}
        {value && (
          <ScheduleDetails 
            schedule={paymentSchedules.find(s => s.id === value)} 
            commissionAmount={commissionAmount} 
          />
        )}
      </div>
    );
  }
  
  // Get the currently selected schedule
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
      
      {selectedSchedule && <ScheduleDetails schedule={selectedSchedule} commissionAmount={commissionAmount} />}
    </div>
  );
};

// Extracted schedule details into a separate component for readability
const ScheduleDetails: React.FC<{ 
  schedule: PaymentSchedule | undefined; 
  commissionAmount: number;
}> = ({ schedule, commissionAmount }) => {
  if (!schedule) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">{schedule.name}</CardTitle>
        {schedule.description && (
          <CardDescription>{schedule.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {schedule.installments.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">No installments defined for this schedule</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schedule.installments
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
  );
};

export default PaymentScheduleSelector;
