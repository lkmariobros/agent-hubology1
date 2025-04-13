
import React, { useEffect } from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CommissionInputsProps {
  isRental: boolean;
  ownerCommissionAmount: number;
  setOwnerCommissionAmount: (amount: number) => void;
}

const CommissionInputs: React.FC<CommissionInputsProps> = ({ 
  isRental, 
  ownerCommissionAmount, 
  setOwnerCommissionAmount 
}) => {
  const { state, updateFormData } = useClerkTransactionForm();
  const { formData } = state;
  
  // Get transaction value and commission rate from form data
  const transactionValue = formData.transactionValue || 0;
  const commissionRate = formData.commissionRate || 0;
  
  // Calculate commission amount when transaction value or rate changes
  useEffect(() => {
    const calculatedAmount = (transactionValue * commissionRate) / 100;
    updateFormData({ commissionAmount: calculatedAmount });
    setOwnerCommissionAmount(calculatedAmount);
  }, [transactionValue, commissionRate, updateFormData, setOwnerCommissionAmount]);
  
  // Handle transaction value change
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ transactionValue: value });
  };
  
  // Handle commission rate change
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    updateFormData({ commissionRate: rate });
  };
  
  // Handle manual commission amount change (overrides the calculated amount)
  const handleCommissionAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setOwnerCommissionAmount(amount);
    updateFormData({ commissionAmount: amount });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="transactionValue">
          {isRental ? 'Rental Value' : 'Transaction Value'}
        </Label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            type="number"
            name="transactionValue"
            id="transactionValue"
            placeholder="0.00"
            value={transactionValue || ''}
            onChange={handleTransactionValueChange}
            className="pl-7"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
        <div className="mt-1 relative">
          <Input
            type="number"
            name="commissionRate"
            id="commissionRate"
            placeholder="0.00"
            value={commissionRate || ''}
            onChange={handleCommissionRateChange}
            step="0.1"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">%</span>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="commissionAmount">Commission Amount</Label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            type="number"
            name="commissionAmount"
            id="commissionAmount"
            placeholder="0.00"
            value={ownerCommissionAmount || ''}
            onChange={handleCommissionAmountChange}
            className="pl-7"
          />
        </div>
      </div>
    </div>
  );
};

export default CommissionInputs;
