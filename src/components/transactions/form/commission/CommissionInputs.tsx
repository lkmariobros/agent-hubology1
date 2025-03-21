
import React, { useEffect } from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { getDefaultCommissionRate } from '@/context/TransactionForm/initialState';
import { DollarSign, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isRentalTransaction, getTransactionValueLabel } from './utils';

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
  const { state, updateFormData } = useTransactionForm();
  const { formData, errors } = state;

  // Update default commission rate when transaction type changes
  useEffect(() => {
    if (formData.commissionRate === 0) {
      const defaultRate = getDefaultCommissionRate(formData.transactionType);
      updateFormData({
        commissionRate: defaultRate
      });
    }
  }, [formData.transactionType, formData.commissionRate, updateFormData]);

  // Handler for transaction value changes
  const handleTransactionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({
      transactionValue: value
    });
    
    // For rental transactions, default the owner commission to the monthly rent value
    if (isRental) {
      setOwnerCommissionAmount(value);
      updateFormData({
        commissionAmount: value // Set default commission to one month's rent
      });
    }
  };

  // Handler for owner commission amount changes (for rentals)
  const handleOwnerCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setOwnerCommissionAmount(amount);
    
    // Update the commission amount in the form data directly
    updateFormData({
      commissionAmount: amount
    });
  };

  // Handler for commission rate changes
  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    updateFormData({
      commissionRate: rate
    });
  };

  // Handle tab selection for predefined commission rates
  const handleTabChange = (value: string) => {
    if (value !== 'Custom') {
      updateFormData({
        commissionRate: parseFloat(value)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="transactionValue" className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          {getTransactionValueLabel(formData.transactionType)}
        </Label>
        <Input 
          id="transactionValue" 
          type="number" 
          value={formData.transactionValue || ''} 
          onChange={handleTransactionValueChange} 
          placeholder={isRental ? "Enter monthly rental value" : "Enter transaction value"} 
          className={errors.transactionValue ? 'border-destructive' : ''} 
        />
        {errors.transactionValue && <p className="text-sm text-destructive mt-1">{errors.transactionValue}</p>}
      </div>
      
      {isRental ? (
        <div>
          <Label htmlFor="ownerCommission" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Owner Commission Amount
          </Label>
          <Input 
            id="ownerCommission" 
            type="number" 
            value={ownerCommissionAmount || ''} 
            onChange={handleOwnerCommissionChange} 
            placeholder="Enter owner commission amount" 
            className={errors.commissionAmount ? 'border-destructive' : ''} 
          />
          {errors.commissionAmount && <p className="text-sm text-destructive mt-1">{errors.commissionAmount}</p>}
          <p className="text-xs text-muted-foreground mt-1">
            The amount of commission provided by the property owner (typically one month's rent).
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="commissionRate" className="flex items-center gap-1">
            <Percent className="h-4 w-4" />
            Commission Rate (%)
          </Label>
          <Tabs defaultValue={formData.commissionRate ? formData.commissionRate.toString() : "2"} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="1">1%</TabsTrigger>
              <TabsTrigger value="2">2%</TabsTrigger>
              <TabsTrigger value="3">3%</TabsTrigger>
              <TabsTrigger value="Custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="Custom" className="mt-2">
              <Input id="commissionRate" type="number" min="0.1" max="10" step="0.1" value={formData.commissionRate || 0} onChange={handleCommissionRateChange} className={errors.commissionRate ? 'border-destructive' : ''} />
            </TabsContent>
          </Tabs>
          {errors.commissionRate && <p className="text-sm text-destructive mt-1">{errors.commissionRate}</p>}
        </div>
      )}
    </div>
  );
};

export default CommissionInputs;
