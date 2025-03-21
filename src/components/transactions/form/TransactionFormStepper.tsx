
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
      {/* We remove the heading since it's not in the screenshot */}
      <div className="relative px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div 
                className="flex flex-col items-center cursor-pointer relative"
                onClick={() => goToStep(step.id)}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border transition-colors ${
                    step.id < currentStep 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : step.id === currentStep 
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/20 border-muted-foreground/20 text-muted-foreground'
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

                {/* Connector line (except after the last step) */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute top-5 left-[calc(100%+2px)] w-[calc(100%-10px)] h-[1px] -translate-y-1/2 bg-muted"
                    style={{ 
                      width: `calc((100vw - (${steps.length} * 70px)) / ${steps.length - 1})`,
                    }}
                  >
                    <div 
                      className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out`}
                      style={{ 
                        width: currentStep > index ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
