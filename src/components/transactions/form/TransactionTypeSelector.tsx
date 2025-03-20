
import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Home, DollarSign } from 'lucide-react';
import { TransactionType } from '@/types/transaction-form';

const TransactionTypeSelector: React.FC = () => {
  const { state, updateTransactionType } = useTransactionForm();
  const { formData, errors } = state;

  const handleTypeChange = (value: TransactionType) => {
    updateTransactionType(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Transaction Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of transaction you're creating
        </p>
      </div>

      <RadioGroup
        value={formData.transactionType}
        onValueChange={handleTypeChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 
          ${formData.transactionType === 'Sale' ? 'border-primary' : 'border-input'}`}>
          <RadioGroupItem value="Sale" id="sale" className="sr-only" />
          <div className="flex items-center justify-center">
            <Label 
              htmlFor="sale"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Home className="h-8 w-8 text-primary" />
              <span className="font-medium">Sale</span>
              <span className="text-xs text-muted-foreground text-center">
                Property sale between buyer and seller
              </span>
            </Label>
          </div>
        </div>
        
        <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 
          ${formData.transactionType === 'Rent' ? 'border-primary' : 'border-input'}`}>
          <RadioGroupItem value="Rent" id="rent" className="sr-only" />
          <div className="flex items-center justify-center">
            <Label 
              htmlFor="rent"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <CreditCard className="h-8 w-8 text-primary" />
              <span className="font-medium">Rent</span>
              <span className="text-xs text-muted-foreground text-center">
                Rental agreement between landlord and tenant
              </span>
            </Label>
          </div>
        </div>
        
        <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 
          ${formData.transactionType === 'Primary' ? 'border-primary' : 'border-input'}`}>
          <RadioGroupItem value="Primary" id="primary" className="sr-only" />
          <div className="flex items-center justify-center">
            <Label 
              htmlFor="primary"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Building className="h-8 w-8 text-primary" />
              <span className="font-medium">Primary Project</span>
              <span className="text-xs text-muted-foreground text-center">
                New development purchase from developer
              </span>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {errors.transactionType && (
        <p className="text-sm text-destructive">{errors.transactionType}</p>
      )}

      <div className="border rounded-md p-4 bg-muted/30 space-y-3 mt-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Commission Information</h4>
        </div>
        <p className="text-sm">
          Default commission rates:
        </p>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>Sale: 2% of transaction value</li>
          <li>Rent: 1% of annual rental value</li>
          <li>Primary Project: 3% of transaction value</li>
        </ul>
        <p className="text-sm italic">
          These rates can be adjusted in later steps if needed.
        </p>
      </div>
    </div>
  );
};

export default TransactionTypeSelector;
