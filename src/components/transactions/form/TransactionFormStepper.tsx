
import React from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { 
  FileText, 
  Home, 
  Users, 
  Calculator, 
  Upload, 
  Save, 
  CreditCard 
} from 'lucide-react';

const TransactionFormStepper: React.FC = () => {
  const { state, goToStep } = useTransactionForm();
  const { currentStep } = state;

  console.log('TransactionFormStepper rendered with currentStep:', currentStep);

  const steps = [
    { label: 'Transaction Type', icon: <CreditCard className="h-4 w-4" /> },
    { label: 'Property', icon: <Home className="h-4 w-4" /> },
    { label: 'Clients', icon: <Users className="h-4 w-4" /> },
    { label: 'Co-Broking', icon: <FileText className="h-4 w-4" /> },
    { label: 'Commission', icon: <Calculator className="h-4 w-4" /> },
    { label: 'Documents', icon: <Upload className="h-4 w-4" /> },
    { label: 'Review', icon: <Save className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          // Using this pattern instead of React.Fragment to avoid the data-lov-id prop warning
          return [
            <div 
              key={`step-${index}`}
              className="flex flex-col items-center z-10 cursor-pointer" 
              onClick={() => goToStep(index)}
            >
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>,
            
            // Only render the connector line if not the last item
            index < steps.length - 1 ? (
              <div 
                key={`connector-${index}`}
                className="flex-grow mx-2 h-0.5 self-center relative"
              >
                <div className="absolute inset-0 bg-muted"></div>
                <div 
                  className="absolute inset-0 bg-primary transition-all duration-200 ease-in-out"
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                ></div>
              </div>
            ) : null
          ];
        }).flat().filter(Boolean)}
      </div>
    </div>
  );
};

export default TransactionFormStepper;
