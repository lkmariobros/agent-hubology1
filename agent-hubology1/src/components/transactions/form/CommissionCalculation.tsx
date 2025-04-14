
import React from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Button } from '@/components/ui/button';

// Extremely minimal component for debugging
const CommissionCalculation: React.FC = () => {
  console.log('Rendering CommissionCalculation - Minimal Debug Version');

  const { nextStep, prevStep, updateFormData } = useClerkTransactionForm();

  // Set default values immediately without any hooks or calculations
  React.useEffect(() => {
    console.log('Setting default values for debugging');
    updateFormData({
      transactionValue: 100000,
      commissionRate: 5,
      commissionAmount: 5000,
      paymentScheduleId: 'fallback-1'
    });
  }, [updateFormData]);

  // Simple function to proceed to next step
  const handleContinue = () => {
    console.log('Proceeding to next step');
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Calculation (Debug Mode)</h2>
      <p className="text-muted-foreground">
        Using default values for debugging: $100,000 transaction with 5% commission.
      </p>

      <div className="p-4 border rounded bg-muted">
        <p><strong>Transaction Value:</strong> $100,000</p>
        <p><strong>Commission Rate:</strong> 5%</p>
        <p><strong>Commission Amount:</strong> $5,000</p>
        <p><strong>Payment Schedule:</strong> Standard (Default)</p>
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

export default CommissionCalculation;
