
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Trash, Plus, Save } from 'lucide-react';
import { useCommissionForecast } from '@/hooks/useCommissionForecast';
import { CommissionForecastSettings, InstallmentAmountConfig } from '@/types/commission';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface CommissionScheduleSettingsProps {
  agencyId: string;
}

const CommissionScheduleSettings: React.FC<CommissionScheduleSettingsProps> = ({ agencyId }) => {
  const { useForecastSettings, useUpdateForecastSettingsMutation } = useCommissionForecast();
  const { data: settings, isLoading } = useForecastSettings(agencyId);
  const updateSettings = useUpdateForecastSettingsMutation();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CommissionForecastSettings>();
  const installments = watch('default_installment_amounts') || [];

  // Initialize form values when settings load
  React.useEffect(() => {
    if (settings) {
      setValue('payment_cutoff_day', settings.payment_cutoff_day);
      setValue('default_installment_count', settings.default_installment_count);
      setValue('default_installment_amounts', settings.default_installment_amounts);
      setValue('forecast_horizon_months', settings.forecast_horizon_months);
    }
  }, [settings, setValue]);

  // Handle form submission
  const onSubmit = (data: CommissionForecastSettings) => {
    // Validate installments add up to expected total or include remainder
    const hasRemainder = data.default_installment_amounts.some(
      i => i.amount === 'remainder'
    );
    
    updateSettings.mutate({
      ...data,
      agency_id: agencyId
    });
  };

  // Add new installment
  const addInstallment = () => {
    const newInstallments = [...(installments || [])];
    newInstallments.push({
      number: newInstallments.length + 1,
      amount: 0
    });
    setValue('default_installment_amounts', newInstallments);
  };

  // Remove installment
  const removeInstallment = (index: number) => {
    const newInstallments = [...(installments || [])];
    newInstallments.splice(index, 1);
    
    // Renumber installments
    newInstallments.forEach((item, i) => {
      item.number = i + 1;
    });
    
    setValue('default_installment_amounts', newInstallments);
  };

  // Update installment amount
  const updateInstallmentAmount = (index: number, value: string) => {
    const newInstallments = [...(installments || [])];
    
    if (value.toLowerCase() === 'remainder') {
      newInstallments[index].amount = 'remainder';
    } else {
      const numValue = parseFloat(value);
      newInstallments[index].amount = isNaN(numValue) ? 0 : numValue;
    }
    
    setValue('default_installment_amounts', newInstallments);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Schedule Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Schedule Settings</CardTitle>
        <CardDescription>Configure default payment schedule settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="payment_cutoff_day">Payment Cutoff Day</Label>
              <Input
                id="payment_cutoff_day"
                type="number"
                {...register('payment_cutoff_day', { 
                  required: 'Required',
                  min: { value: 1, message: 'Must be between 1 and 31' },
                  max: { value: 31, message: 'Must be between 1 and 31' }
                })}
              />
              {errors.payment_cutoff_day && (
                <p className="text-xs text-red-500">{errors.payment_cutoff_day.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Day of month when installments are processed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="forecast_horizon_months">Forecast Horizon (Months)</Label>
              <Input
                id="forecast_horizon_months"
                type="number"
                {...register('forecast_horizon_months', { 
                  required: 'Required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 36, message: 'Cannot exceed 36 months' }
                })}
              />
              {errors.forecast_horizon_months && (
                <p className="text-xs text-red-500">{errors.forecast_horizon_months.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Number of months to include in forecasts
              </p>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label>Default Installment Configuration</Label>
              
              <div className="space-y-2">
                {installments?.map((installment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-14 shrink-0">
                      <Label className="sr-only" htmlFor={`installment-${index}`}>
                        Installment {installment.number}
                      </Label>
                      <div className="h-10 flex items-center justify-center bg-muted rounded-md">
                        #{installment.number}
                      </div>
                    </div>
                    
                    <Input
                      id={`installment-${index}`}
                      value={installment.amount === 'remainder' ? 'remainder' : installment.amount}
                      onChange={(e) => updateInstallmentAmount(index, e.target.value)}
                      placeholder="Amount or 'remainder'"
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstallment(index)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove installment {installment.number}</span>
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addInstallment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Installment
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Set installment amounts or use 'remainder' for the final installment to automatically calculate the balance
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={updateSettings.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommissionScheduleSettings;
