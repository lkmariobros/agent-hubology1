
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
      <div className="relative">
        {/* Background line - now properly centered and positioned */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-muted"></div>
        
        {/* Progress line - now with correct alignment and calculation */}
        <div 
          className="absolute top-1/2 left-6 -translate-y-1/2 h-[2px] bg-primary transition-all duration-300"
          style={{ 
            width: currentStep > 0 
              ? `calc(${(currentStep / (steps.length - 1)) * 100}% - ${12}px)` 
              : '0px'
          }}
        ></div>
        
        {/* Step circles positioned above the line */}
        <div className="flex justify-between items-center relative">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex flex-col items-center z-20 cursor-pointer"
              onClick={() => goToStep(step.id)}
            >
              <div 
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-colors
                ${step.id < currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : step.id === currentStep 
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground/30 text-muted-foreground'}`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              <span 
                className={`text-xs font-medium ${
                  step.id <= currentStep 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
