
import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Home, Building, Key } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionType } from '@/types/transaction-form';

const transactionTypes: {
  type: TransactionType;
  title: string;
  description: string;
  icon: React.ReactNode;
  commissionInfo: string;
}[] = [
  {
    type: 'Sale',
    title: 'Property Sale',
    description: 'Sale transaction between a buyer and seller',
    icon: <Home className="h-8 w-8" />,
    commissionInfo: '2% standard commission'
  },
  {
    type: 'Rent',
    title: 'Property Rental',
    description: 'Rental transaction between a tenant and landlord',
    icon: <Key className="h-8 w-8" />,
    commissionInfo: '1% standard commission'
  },
  {
    type: 'Primary',
    title: 'Developer Project',
    description: 'Primary market sale from a developer to a buyer',
    icon: <Building className="h-8 w-8" />,
    commissionInfo: '3% standard commission'
  }
];

const TransactionTypeSelector: React.FC = () => {
  const { state, updateTransactionType } = useTransactionForm();
  const { formData } = state;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Transaction Type</h2>
      <p className="text-muted-foreground">
        Choose the type of transaction you want to create. The form fields and commission structure will adjust based on your selection.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transactionTypes.map((type) => (
          <Card 
            key={type.type}
            className={`cursor-pointer transition-all ${
              formData.transactionType === type.type
                ? 'ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => updateTransactionType(type.type)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <div className={`p-2 rounded-full ${
                  formData.transactionType === type.type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {type.icon}
                </div>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{type.commissionInfo}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={formData.transactionType === type.type ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransactionType(type.type);
                }}
              >
                {formData.transactionType === type.type ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransactionTypeSelector;
