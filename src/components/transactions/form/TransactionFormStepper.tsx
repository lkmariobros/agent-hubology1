
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
      <div className="relative px-6">
        <div className="flex justify-between items-center relative">
          {/* Step circles and connecting lines */}
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Only render line before the circle if it's not the first step */}
              {index > 0 && (
                <div className="flex-1 h-0.5 relative">
                  <div 
                    className={`absolute h-0.5 w-full ${
                      currentStep > index ? 'bg-primary' : 'bg-muted'
                    } transition-colors duration-300`}
                  />
                </div>
              )}
              
              {/* Step circle */}
              <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(step.id)}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    currentStep > step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep === step.id 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-muted-foreground/30'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.icon}
                </div>
                <span 
                  className={`text-xs font-medium ${
                    currentStep >= step.id 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
