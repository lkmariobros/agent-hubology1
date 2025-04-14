
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm';
import { Check, Home, MapPin, ImageIcon, File, Info, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { name: 'Basic Info', icon: Info },
  { name: 'Details', icon: Home },
  { name: 'Location', icon: MapPin },
  { name: 'Contacts', icon: User },
  { name: 'Images', icon: ImageIcon },
  { name: 'Documents', icon: File },
  { name: 'Review', icon: Check },
];

const PropertyFormStepper: React.FC = () => {
  const { state, goToStep } = usePropertyForm();
  const { currentStep } = state;

  return (
    <nav aria-label="Progress">
      <ol className="overflow-x-auto flex space-x-4 p-1 sm:hidden">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="flex-shrink-0">
            <button
              type="button"
              onClick={() => goToStep(stepIdx)}
              className={cn(
                "flex flex-col items-center justify-center p-2 w-14 h-14 rounded-lg transition-colors",
                stepIdx === currentStep
                  ? "bg-primary/10 text-primary"
                  : stepIdx < currentStep
                  ? "bg-primary/5 text-primary/80 hover:bg-primary/10"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <step.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{stepIdx + 1}</span>
            </button>
          </li>
        ))}
      </ol>

      <ol className="hidden sm:flex items-center space-x-2 justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="flex-1">
            {stepIdx !== 0 && (
              <div className="hidden sm:flex flex-1 justify-center mx-2 -translate-x-1/2">
                <div
                  className={cn(
                    "h-0.5 w-full",
                    stepIdx <= currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            )}
            
            <button
              type="button"
              onClick={() => goToStep(stepIdx)}
              disabled={stepIdx > currentStep}
              className={cn(
                "group flex flex-col items-center text-sm font-medium",
                stepIdx <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                  stepIdx < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : stepIdx === currentStep
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground bg-background"
                )}
              >
                {stepIdx < currentStep ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "mt-1",
                  stepIdx <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PropertyFormStepper;
