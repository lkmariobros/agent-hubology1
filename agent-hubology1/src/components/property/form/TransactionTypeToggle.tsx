
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock } from 'lucide-react';

const TransactionTypeToggle: React.FC = () => {
  const { state, updateTransactionType } = usePropertyForm();
  const { transactionType } = state.formData;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Transaction Type</h3>
      <Tabs
        value={transactionType}
        onValueChange={(value) => updateTransactionType(value as 'Sale' | 'Rent')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="Sale" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Sale</span>
          </TabsTrigger>
          <TabsTrigger value="Rent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Rent</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TransactionTypeToggle;
