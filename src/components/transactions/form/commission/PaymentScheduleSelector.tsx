
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentSchedule } from '@/types/commission';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { formatCurrency } from '@/utils/commissionSchedule';

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
    return <p className="text-sm text-muted-foreground">Loading payment schedules...</p>;
  }
  
  if (error || !paymentSchedules) {
    return <p className="text-sm text-destructive">Error loading payment schedules</p>;
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
              {selectedSchedule.installments.map((installment) => (
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
