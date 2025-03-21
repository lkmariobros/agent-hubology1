
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
      <div className="flex justify-between items-center relative px-4">
        {/* Progress line that sits behind the circles */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-muted -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 h-[1px] bg-primary -translate-y-1/2 transition-all duration-500 ease-in-out" 
          style={{ 
            width: `calc(${currentStep} * (100% / ${steps.length - 1}))`,
          }} 
        />
        
        {/* Step circles and labels positioned on top of the lines */}
        {steps.map((step) => (
          <div 
            key={step.id}
            className="flex flex-col items-center z-10 cursor-pointer"
            onClick={() => goToStep(step.id)}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border transition-colors ${
                step.id < currentStep 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : step.id === currentStep 
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-muted-foreground/20 text-muted-foreground'
              }`}
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
  );
};

export default TransactionFormStepper;
