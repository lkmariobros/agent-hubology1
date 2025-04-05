
import React from 'react';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, Store } from 'lucide-react';

type TransactionType = 'Sale' | 'Rent' | 'Primary';

interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

const TransactionTypeToggle: React.FC<TransactionTypeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant={value === 'Sale' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Sale')}
      >
        <BadgeDollarSign className="h-5 w-5" />
        <span>Sale</span>
      </Button>
      
      <Button
        type="button"
        variant={value === 'Rent' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Rent')}
      >
        <Store className="h-5 w-5" />
        <span>Rent</span>
      </Button>
    </div>
  );
};

export default TransactionTypeToggle;
