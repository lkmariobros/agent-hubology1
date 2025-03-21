
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
      
      <div className="px-6">
        <div className="flex justify-between relative">
          {/* Step circles with labels */}
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="flex flex-col items-center z-20 relative cursor-pointer"
              onClick={() => goToStep(step.id)}
            >
              {/* Step circle */}
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                ${step.id < currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step.id === currentStep 
                    ? 'bg-primary text-primary-foreground'
                    : step.id === currentStep + 1 
                      ? 'bg-muted/80 border border-muted-foreground/30'
                      : 'bg-muted text-muted-foreground'}`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              
              {/* Step label */}
              <span 
                className={`text-xs font-medium ${
                  step.id <= currentStep 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              
              {/* Connection lines between steps */}
              {index < steps.length - 1 && (
                <div 
                  className="absolute top-6 h-0.5 transform translate-x-[calc(50%+6px)]"
                  style={{ 
                    width: 'calc(100% - 12px)',
                    left: '0',
                    backgroundColor: step.id < currentStep 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--muted))'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
