import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAgentProfile } from '@/hooks/useAgentProfile';
import { TransactionType } from '@/types';

interface CommissionInputsProps {
  isRental: boolean;
  ownerCommissionAmount: number;
  setOwnerCommissionAmount: React.Dispatch<React.SetStateAction<number>>;
}

const CommissionInputs: React.FC<CommissionInputsProps> = ({ isRental, ownerCommissionAmount, setOwnerCommissionAmount }) => {
  const { state, updateFormData } = useTransactionForm();
  const { formData } = state;
  const { data: agentProfile } = useAgentProfile();
  
  // Add type casting where necessary
  const isRentalTransaction = formData.transactionType === 'Rent' as TransactionType;
  
  return (
    <div className="space-y-4">
      <FormField
        control={useTransactionForm().form.control}
        name="transactionValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction Value</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={formData.transactionValue?.toString() || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    updateFormData({ transactionValue: isNaN(value) ? 0 : value });
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={useTransactionForm().form.control}
        name="commissionRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commission Rate (%)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pr-7"
                  value={formData.commissionRate?.toString() || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    updateFormData({ commissionRate: isNaN(value) ? 0 : value });
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={useTransactionForm().form.control}
        name="commissionAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commission Amount</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={formData.commissionAmount?.toString() || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    updateFormData({ commissionAmount: isNaN(value) ? 0 : value });
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CommissionInputs;
