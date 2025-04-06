
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  completed?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  const getStepStatus = (stepId: string, index: number) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (steps[index].completed) {
      return 'completed';
    }
    
    if (stepId === currentStep) {
      return 'current';
    }
    
    if (index < currentIndex) {
      return 'previous';
    }
    
    return 'upcoming';
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors border",
                  getStepStatus(step.id, index) === 'completed' && "bg-primary border-primary text-primary-foreground",
                  getStepStatus(step.id, index) === 'current' && "border-primary bg-primary/10 text-primary",
                  getStepStatus(step.id, index) === 'previous' && "border-muted-foreground/50 text-muted-foreground",
                  getStepStatus(step.id, index) === 'upcoming' && "border-muted-foreground/30 text-muted-foreground/30",
                  onStepClick && "cursor-pointer hover:border-primary/50",
                )}
                onClick={() => onStepClick && onStepClick(step.id)}
              >
                {getStepStatus(step.id, index) === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-medium",
                  getStepStatus(step.id, index) === 'current' && "text-primary",
                  getStepStatus(step.id, index) === 'upcoming' && "text-muted-foreground/50",
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  getStepStatus(steps[index + 1].id, index + 1) === 'upcoming' ? 
                    "bg-muted-foreground/30" :
                    "bg-primary"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
