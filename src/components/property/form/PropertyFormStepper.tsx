
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Info, Home, MapPin, Image, FileText, Save } from 'lucide-react';

const PropertyFormStepper: React.FC = () => {
  const { state, goToStep } = usePropertyForm();
  const { currentStep } = state;

  const steps = [
    { label: 'Basic Info', icon: <Info className="h-4 w-4" /> },
    { label: 'Details', icon: <Home className="h-4 w-4" /> },
    { label: 'Location', icon: <MapPin className="h-4 w-4" /> },
    { label: 'Images', icon: <Image className="h-4 w-4" /> },
    { label: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { label: 'Review', icon: <Save className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className="flex flex-col items-center z-10 cursor-pointer" 
              onClick={() => goToStep(index)}
            >
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-grow mx-2 h-0.5 self-center relative">
                <div className={`absolute inset-0 bg-muted`}></div>
                <div 
                  className={`absolute inset-0 bg-primary transition-all duration-200 ease-in-out`}
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PropertyFormStepper;
