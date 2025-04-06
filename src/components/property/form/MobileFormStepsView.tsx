
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { FormSteps } from './FormStepsNavigation';
import PropertyBasicInfo from './PropertyBasicInfo';
import PropertyDetails from './PropertyDetails';
import PropertyLocation from './PropertyLocation';
import PropertyPricing from './PropertyPricing';
import PropertyFeatures from './PropertyFeatures';
import PropertyOwnerInfo from './PropertyOwnerInfo';
import PropertyImageManager from './PropertyImageManager';
import PropertyDocuments from './PropertyDocuments';

interface MobileFormStepsViewProps {
  storageReady?: boolean;
}

const MobileFormStepsView: React.FC<MobileFormStepsViewProps> = ({ storageReady = true }) => {
  const { state } = usePropertyForm();
  const currentStepIndex = state.currentStep;
  
  return (
    <div className="md:hidden">
      <div className="text-lg font-semibold mb-4">
        {FormSteps[currentStepIndex]?.label || 'Property Form'}
      </div>
      
      {state.currentStep === 0 && <PropertyBasicInfo />}
      {state.currentStep === 1 && <PropertyDetails />}
      {state.currentStep === 2 && <PropertyLocation />}
      {state.currentStep === 3 && <PropertyPricing />}
      {state.currentStep === 4 && <PropertyFeatures />}
      {state.currentStep === 5 && <PropertyOwnerInfo />}
      {state.currentStep === 6 && (
        <Card>
          <CardContent className="pt-6">
            <PropertyImageManager />
          </CardContent>
        </Card>
      )}
      {state.currentStep === 7 && <PropertyDocuments />}
    </div>
  );
};

export default MobileFormStepsView;
