
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
      <div className="relative">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div 
                className="flex flex-col items-center z-20 cursor-pointer"
                onClick={() => goToStep(step.id)}
              >
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
              
              {/* Connector line (only between circles, not after the last one) */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center h-[1px] mx-2">
                  <div className="w-full h-[1px] bg-muted"></div>
                  <div 
                    className="absolute h-[1px] bg-primary transition-all duration-300 ease-in-out"
                    style={{ 
                      width: currentStep > index ? '100%' : '0%',
                      left: 0,
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
