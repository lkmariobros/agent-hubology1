
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentScheduleSelectorProps {
  onScheduleSelected: (scheduleId: string) => void;
  selectedScheduleId?: string;
}

const PaymentScheduleSelector: React.FC<PaymentScheduleSelectorProps> = ({ 
  onScheduleSelected,
  selectedScheduleId
}) => {
  const { data: schedules, isLoading, error } = usePaymentSchedules();
  
  // Auto-select default schedule if none is selected
  useEffect(() => {
    if (!selectedScheduleId && schedules && schedules.length > 0) {
      const defaultSchedule = schedules.find(schedule => schedule.is_default);
      if (defaultSchedule) {
        onScheduleSelected(defaultSchedule.id);
      }
    }
  }, [schedules, selectedScheduleId, onScheduleSelected]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="text-red-500">Failed to Load Payment Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load payment schedules. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!schedules || schedules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payment schedules available. Please contact an administrator.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedScheduleId} 
          onValueChange={onScheduleSelected}
        >
          {schedules.map((schedule) => (
            <div className="flex items-center space-x-2 mb-2" key={schedule.id}>
              <RadioGroupItem value={schedule.id} id={`schedule-${schedule.id}`} />
              <Label htmlFor={`schedule-${schedule.id}`} className="cursor-pointer">
                <div>
                  <span className="font-medium">{schedule.name}</span>
                  {schedule.is_default && (
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
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleSelector;
