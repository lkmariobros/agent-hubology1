
import React from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Button } from '@/components/ui/button';

const TransactionFormStepper: React.FC = () => {
  const { state, prevStep, nextStep, goToStep } = useClerkTransactionForm();
  const { currentStep } = state;
  
  const steps = [
    'Transaction Type',
    'Property',
    'Client Info',
    'Co-Broking',
    'Commission',
    'Documents',
    'Review'
  ];
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Create an empty object with only the key prop to avoid data-lov-id
          const fragmentProps = { key: index };
          
          return React.createElement(
            React.Fragment,
            fragmentProps,
            <>
              <Button
                variant={currentStep === index ? "default" : "ghost"}
                size="sm"
                className={`rounded-full ${currentStep === index ? "" : "text-muted-foreground"}`}
                onClick={() => goToStep(index)}
                disabled={index > currentStep}
              >
                <span className="mr-2">{index + 1}</span>
                <span className="hidden sm:inline">{step}</span>
              </Button>
              
              {index < steps.length - 1 && (
                <div className="h-px w-full bg-muted" />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionFormStepper;
