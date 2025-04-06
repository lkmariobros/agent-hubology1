
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the form steps
export const FormSteps = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Location' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'features', label: 'Features' },
  { id: 'owner', label: 'Owner' },
  { id: 'media', label: 'Media' },
  { id: 'documents', label: 'Documents' },
];

interface FormStepsNavigationProps {
  children: React.ReactNode;
}

const FormStepsNavigation: React.FC<FormStepsNavigationProps> = ({ children }) => {
  const { state, goToStep } = usePropertyForm();
  
  return (
    <Tabs 
      value={state.currentStep.toString()} 
      onValueChange={(value) => goToStep(parseInt(value))}
      className="w-full"
    >
      <TabsList className="grid grid-cols-8 w-full">
        {FormSteps.map((step, index) => (
          <TabsTrigger 
            key={step.id} 
            value={index.toString()}
            disabled={state.isSubmitting}
          >
            {step.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default FormStepsNavigation;
