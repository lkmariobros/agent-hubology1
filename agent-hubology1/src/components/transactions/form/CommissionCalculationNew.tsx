import React, { useState, useEffect } from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Completely new implementation without any dependencies on problematic components
const CommissionCalculationNew: React.FC = () => {
  console.log('Rendering CommissionCalculationNew');
  
  const { state, updateFormData, nextStep, prevStep } = useClerkTransactionForm();
  const { formData } = state;
  
  // Local state for input fields
  const [transactionValue, setTransactionValue] = useState<string>(
    formData.transactionValue?.toString() || '100000'
  );
  const [commissionRate, setCommissionRate] = useState<string>(
    formData.commissionRate?.toString() || '5'
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    formData.paymentScheduleId || 'fallback-1'
  );
  
  // Set default values on mount
  useEffect(() => {
    console.log('Setting default values');
    updateFormData({
      transactionValue: parseFloat(transactionValue) || 100000,
      commissionRate: parseFloat(commissionRate) || 5,
      commissionAmount: ((parseFloat(transactionValue) || 100000) * (parseFloat(commissionRate) || 5)) / 100,
      paymentScheduleId: selectedScheduleId || 'fallback-1'
    });
  }, []);
  
  // Handle transaction value change
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTransactionValue(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateFormData({ 
        transactionValue: numValue,
        commissionAmount: (numValue * (parseFloat(commissionRate) || 5)) / 100
      });
    }
  };
  
  // Handle commission rate change
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommissionRate(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateFormData({ 
        commissionRate: numValue,
        commissionAmount: ((parseFloat(transactionValue) || 100000) * numValue) / 100
      });
    }
  };
  
  // Handle schedule selection
  const handleScheduleChange = (value: string) => {
    setSelectedScheduleId(value);
    updateFormData({ paymentScheduleId: value });
  };
  
  // Handle continue button click
  const handleContinue = () => {
    // Ensure we have valid values before proceeding
    const tValue = parseFloat(transactionValue) || 100000;
    const cRate = parseFloat(commissionRate) || 5;
    const cAmount = (tValue * cRate) / 100;
    
    updateFormData({
      transactionValue: tValue,
      commissionRate: cRate,
      commissionAmount: cAmount,
      paymentScheduleId: selectedScheduleId || 'fallback-1'
    });
    
    console.log('Proceeding to next step with values:', {
      transactionValue: tValue,
      commissionRate: cRate,
      commissionAmount: cAmount,
      paymentScheduleId: selectedScheduleId || 'fallback-1'
    });
    
    nextStep();
  };
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate commission amount for display
  const commissionAmount = ((parseFloat(transactionValue) || 0) * (parseFloat(commissionRate) || 0)) / 100;
  
  // Payment schedule options
  const scheduleOptions = [
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation</h2>
      <p className="text-muted-foreground">
        Enter the transaction value and commission rate to calculate the commission.
      </p>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input fields */}
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
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter commission rate"
                />
              </div>
              
              {/* Payment Schedule Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedScheduleId} 
                    onValueChange={handleScheduleChange}
                  >
                    {scheduleOptions.map((schedule) => (
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
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction Value:</span>
                <span className="font-medium">{formatCurrency(parseFloat(transactionValue) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Commission Rate:</span>
                <span className="font-medium">{parseFloat(commissionRate) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Commission:</span>
                <span className="font-medium">{formatCurrency(commissionAmount)}</span>
              </div>
            </div>
            
            <div className="h-px w-full bg-border my-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Agent Share (70%):</span>
                <span className="font-medium">{formatCurrency(commissionAmount * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Agency Share (30%):</span>
                <span className="font-medium">{formatCurrency(commissionAmount * 0.3)}</span>
              </div>
            </div>
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
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CommissionCalculationNew;
