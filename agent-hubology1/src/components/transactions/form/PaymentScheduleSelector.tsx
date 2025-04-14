
import React, { useEffect, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentScheduleSelectorProps {
  onScheduleSelected: (scheduleId: string) => void;
  selectedScheduleId?: string;
}

// Memoized component to prevent unnecessary re-renders
const PaymentScheduleSelector: React.FC<PaymentScheduleSelectorProps> = memo(({
  onScheduleSelected,
  selectedScheduleId
}) => {
  const { paymentSchedules, defaultPaymentSchedule, isLoading } = usePaymentSchedules();

  // Memoized handler for schedule selection
  const handleScheduleChange = useCallback((value: string) => {
    console.log('Payment schedule selected:', value);
    onScheduleSelected(value);
  }, [onScheduleSelected]);

  // Auto-select default schedule if none is selected
  useEffect(() => {
    if (!selectedScheduleId && defaultPaymentSchedule) {
      console.log('Auto-selecting default payment schedule:', defaultPaymentSchedule.id);
      onScheduleSelected(defaultPaymentSchedule.id);
    }
  }, [defaultPaymentSchedule, selectedScheduleId, onScheduleSelected]);

  // Always have a valid schedules array
  const schedules = paymentSchedules && paymentSchedules.length > 0
    ? paymentSchedules
    : [
        {
          id: 'fallback-1',
          name: 'Standard (Default)',
          description: 'Standard payment schedule with 3 installments',
          isDefault: true
        },
        {
          id: 'fallback-2',
          name: 'Single Payment',
          description: 'One-time payment upon closing',
          isDefault: false
        }
      ];

  // Ensure we have a valid selected ID
  const currentSelectedId = selectedScheduleId || defaultPaymentSchedule?.id || 'fallback-1';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <RadioGroup
            value={currentSelectedId}
            onValueChange={handleScheduleChange}
          >
            {schedules.map((schedule) => (
              <div className="flex items-center space-x-2 mb-2" key={schedule.id}>
                <RadioGroupItem value={schedule.id} id={`schedule-${schedule.id}`} />
                <Label htmlFor={`schedule-${schedule.id}`} className="cursor-pointer">
                  <div>
                    <span className="font-medium">{schedule.name}</span>
                    {schedule.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary ml-2 px-2 py-0.5 rounded-sm">
                        Default
                      </span>
                    )}
                  </div>
                  {schedule.description && (
                    <p className="text-xs text-muted-foreground mt-1">{schedule.description}</p>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
});

// Add display name for debugging
PaymentScheduleSelector.displayName = 'PaymentScheduleSelector';

export default PaymentScheduleSelector;
