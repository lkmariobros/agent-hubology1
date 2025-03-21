
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

  // Calculate the total number of steps and segments
  const totalSteps = steps.length;
  const totalSegments = totalSteps - 1;

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Step circles and labels positioned with proper spacing */}
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="flex flex-col items-center z-20 cursor-pointer"
              onClick={() => goToStep(step.id)}
            >
              {/* Draw connecting lines between steps */}
              {index > 0 && (
                <>
                  {/* Background line (muted) */}
                  <div 
                    className="absolute h-[2px] bg-muted"
                    style={{
                      left: `calc(${(index - 1) * (100 / totalSegments)}% + 6px)`, 
                      right: `calc(${100 - (index * (100 / totalSegments))}% + 6px)`,
                      top: '24px' // Centered with the circles (12px circle radius)
                    }}
                  ></div>
                  
                  {/* Progress line (filled when step is active/completed) */}
                  {currentStep >= index && (
                    <div 
                      className="absolute h-[2px] bg-primary transition-all duration-300 ease-in-out"
                      style={{
                        left: `calc(${(index - 1) * (100 / totalSegments)}% + 6px)`, 
                        right: `calc(${100 - (index * (100 / totalSegments))}% + 6px)`,
                        top: '24px' // Centered with the circles
                      }}
                    ></div>
                  )}
                </>
              )}

              {/* Circle with icon */}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionFormStepper;
