
import React, { useState, useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import CommissionBreakdownCard from '@/components/commission/CommissionBreakdownCard';
import PaymentScheduleSelector from './PaymentScheduleSelector';
import { usePaymentSchedules } from '@/hooks/usePaymentSchedules';

const CommissionCalculation: React.FC = () => {
  const { state, updateFormData, nextStep, prevStep, calculateCommission, selectPaymentSchedule, clearError } = useTransactionForm();
  const { formData, errors } = state;
  const [transactionValue, setTransactionValue] = useState<string>(formData.transactionValue?.toString() || '');
  const [commissionRate, setCommissionRate] = useState<string>(formData.commissionRate?.toString() || '');
  const commissionBreakdown = calculateCommission();
  const { data: schedules, isLoading } = usePaymentSchedules();
  
  // Effect to validate payment schedule on mount
  useEffect(() => {
    // If we don't have a payment schedule yet and schedules are loaded, auto-select the default one
    if (!formData.paymentScheduleId && schedules?.length > 0) {
      const defaultSchedule = schedules.find(schedule => schedule.is_default);
      if (defaultSchedule) {
        selectPaymentSchedule(defaultSchedule.id);
        clearError('paymentScheduleId');
      }
    }
  }, [schedules, formData.paymentScheduleId, selectPaymentSchedule, clearError]);
  
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionValue(e.target.value);
    const numValue = parseFloat(e.target.value);
    
    if (!isNaN(numValue) && numValue > 0) {
      updateFormData({ transactionValue: numValue });
      clearError('transactionValue');
    }
  };
  
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommissionRate(e.target.value);
    const numValue = parseFloat(e.target.value);
    
    if (!isNaN(numValue) && numValue > 0) {
      updateFormData({ commissionRate: numValue });
      clearError('commissionRate');
    }
  };
  
  const handleBlur = () => {
    // When user leaves the fields, update the commission amount
    if (formData.transactionValue && formData.commissionRate) {
      const commissionAmount = (formData.transactionValue * formData.commissionRate) / 100;
      updateFormData({ commissionAmount });
    }
  };
  
  const validateAndProceed = () => {
    let valid = true;
    
    // Validate transaction value
    if (!formData.transactionValue || formData.transactionValue <= 0) {
      updateFormData({ 
        errors: { 
          ...formData.errors, 
          transactionValue: 'Transaction value must be greater than 0' 
        } 
      });
      valid = false;
    }
    
    // Validate commission rate
    if (!formData.commissionRate || formData.commissionRate <= 0) {
      updateFormData({ 
        errors: { 
          ...formData.errors, 
          commissionRate: 'Commission rate must be greater than 0' 
        } 
      });
      valid = false;
    }
    
    // Validate payment schedule - this is critical
    if (!formData.paymentScheduleId) {
      updateFormData({ 
        errors: { 
          ...formData.errors, 
          paymentScheduleId: 'Please select a payment schedule' 
        } 
      });
      valid = false;
    }
    
    if (valid) {
      nextStep();
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation</h2>
      <p className="text-muted-foreground">
        Enter the transaction value and commission rate to calculate the commission.
      </p>
      
      {errors.transactionValue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.transactionValue}</AlertDescription>
        </Alert>
      )}
      
      {errors.commissionRate && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.commissionRate}</AlertDescription>
        </Alert>
      )}
      
      {errors.paymentScheduleId && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.paymentScheduleId}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transactionValue">Transaction Value</Label>
                <Input
                  id="transactionValue"
                  type="number"
                  value={transactionValue}
                  onChange={handleTransactionValueChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  placeholder="Enter transaction value"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={commissionRate}
                  onChange={handleCommissionRateChange}
                  onBlur={handleBlur}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter commission rate"
                />
              </div>
              
              <div className="mt-2">
                <PaymentScheduleSelector
                  onScheduleSelected={(scheduleId) => {
                    selectPaymentSchedule(scheduleId);
                    clearError('paymentScheduleId');
                  }}
                  selectedScheduleId={formData.paymentScheduleId}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <CommissionBreakdownCard breakdown={commissionBreakdown} />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={validateAndProceed}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CommissionCalculation;
