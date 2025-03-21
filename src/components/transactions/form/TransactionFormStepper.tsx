
import React from 'react';
import { useTransactionForm } from '@/context/TransactionForm';
import { 
  Check, 
  Building2, 
  Users, 
  Handshake, 
  Calculator, 
  FileText, 
  ClipboardCheck 
} from 'lucide-react';

const TransactionFormStepper: React.FC = () => {
  const { state, goToStep } = useTransactionForm();
  const { currentStep } = state;

  console.log('TransactionFormStepper rendered with currentStep:', currentStep);

  const steps = [
    { id: 0, label: 'Transaction Type', icon: <Check className="h-4 w-4" /> },
    { id: 1, label: 'Property', icon: <Building2 className="h-4 w-4" /> },
    { id: 2, label: 'Clients', icon: <Users className="h-4 w-4" /> },
    { id: 3, label: 'Co-Broking', icon: <Handshake className="h-4 w-4" /> },
    { id: 4, label: 'Commission', icon: <Calculator className="h-4 w-4" /> },
    { id: 5, label: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 6, label: 'Review', icon: <ClipboardCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Add New Transaction</h2>
      <div className="relative px-6">
        {/* Container for the step circles and progress lines */}
        <div className="flex relative">
          {/* Progress lines - only render between steps, not beyond */}
          <div className="absolute top-6 left-0 right-0 h-0.5 z-0">
            {steps.map((step, index) => {
              // Don't render a line after the last step
              if (index === steps.length - 1) return null;
              
              const isCompleted = currentStep > index;
              const linePosition = `calc(${index * (100 / (steps.length - 1))}% + 12px)`;
              const lineWidth = `calc(${100 / (steps.length - 1)}% - 24px)`;
              
              return (
                <div
                  key={`line-${index}`}
                  className={`absolute h-full ${isCompleted ? 'bg-primary' : 'bg-muted'} transition-colors duration-300`}
                  style={{
                    left: linePosition,
                    width: lineWidth,
                  }}
                />
              );
            })}
          </div>
          
          {/* Step circles */}
          <div className="flex justify-between w-full relative z-10">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center cursor-pointer`}
                  onClick={() => goToStep(step.id)}
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isCurrent 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-muted-foreground/30'}`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                  </div>
                  <span 
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
