
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCommissionForecast, ForecastSettings } from '@/hooks/useCommissionForecast';
import { Loader2 } from 'lucide-react';

const CommissionScheduleSettings = () => {
  const commissionForecastHooks = useCommissionForecast();
  
  const { 
    data: settings, 
    isLoading 
  } = commissionForecastHooks.useForecastSettings();
  
  const { 
    mutateAsync: updateSettings, 
    isPending: isUpdating 
  } = commissionForecastHooks.useUpdateForecastSettingsMutation();
  
  const [formValues, setFormValues] = useState<ForecastSettings>({
    installmentCount: 3,
    paymentCutoffDay: 15,
    firstPaymentDelay: 30
  });
  
  useEffect(() => {
    if (settings) {
      setFormValues(settings);
    }
  }, [settings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formValues);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Payment Schedule Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="installmentCount">Default Number of Installments</Label>
              <Input 
                id="installmentCount"
                name="installmentCount"
                type="number"
                min="1"
                max="12"
                value={formValues.installmentCount}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                The default number of installments for commission payments
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="paymentCutoffDay">Payment Cutoff Day</Label>
              <Input 
                id="paymentCutoffDay"
                name="paymentCutoffDay"
                type="number"
                min="1"
                max="28"
                value={formValues.paymentCutoffDay}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Day of the month (1-28) used as cutoff for payment processing
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="firstPaymentDelay">First Payment Delay (days)</Label>
              <Input 
                id="firstPaymentDelay"
                name="firstPaymentDelay"
                type="number"
                min="0"
                max="90"
                value={formValues.firstPaymentDelay}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of days to delay the first installment payment after approval
              </p>
            </div>
          </div>
          
          <CardFooter className="flex justify-end pt-6 px-0">
            <Button 
              type="submit" 
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Settings'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommissionScheduleSettings;
