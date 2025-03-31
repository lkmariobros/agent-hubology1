
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import useCommissionSchedules from '@/hooks/useCommissionSchedules';

interface PaymentScheduleGeneratorProps {
  approvalId: string;
}

interface FormValues {
  installmentCount: number;
  startDate: Date;
}

const PaymentScheduleGenerator: React.FC<PaymentScheduleGeneratorProps> = ({ approvalId }) => {
  const { useGenerateScheduleMutation } = useCommissionSchedules();
  const generateSchedule = useGenerateScheduleMutation();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      installmentCount: 4,
      startDate: new Date()
    }
  });
  
  const startDate = watch('startDate');
  
  const onSubmit = (data: FormValues) => {
    generateSchedule.mutate({
      approvalId,
      installmentCount: data.installmentCount,
      startDate: format(data.startDate, 'yyyy-MM-dd')
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Payment Schedule</CardTitle>
        <CardDescription>
          Create a new payment schedule for this approved commission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="installmentCount">Number of Installments</Label>
              <Input
                id="installmentCount"
                type="number"
                {...register('installmentCount', { 
                  required: 'Required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 12, message: 'Cannot exceed 12' }
                })}
              />
              {errors.installmentCount && (
                <p className="text-xs text-red-500">{errors.installmentCount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={generateSchedule.isPending}
            >
              {generateSchedule.isPending ? 'Generating...' : 'Generate Schedule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleGenerator;
