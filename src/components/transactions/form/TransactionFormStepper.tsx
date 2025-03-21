
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
      <div className="flex items-center justify-between relative">
        {/* Background line (unfilled) */}
        <div className="absolute h-0.5 bg-muted top-6 left-6 right-6 z-0"></div>
        
        {/* Progress line (filled) */}
        <div 
          className="absolute h-0.5 bg-primary top-6 left-6 z-10 transition-all duration-300 ease-in-out"
          style={{ 
            width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 6px)`,
          }}
        ></div>
        
        {/* Steps */}
        {steps.map((step) => (
          <div 
            key={step.id}
            className="flex flex-col items-center z-20 cursor-pointer" 
            onClick={() => goToStep(step.id)}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
              ${step.id <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : step.id === currentStep + 1 
                  ? 'bg-muted/80 border border-muted-foreground/30'
                  : 'bg-muted text-muted-foreground'}`}
            >
              {step.icon}
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
