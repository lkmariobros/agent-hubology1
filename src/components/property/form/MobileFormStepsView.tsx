
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
  
  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return <PropertyBasicInfo />;
      case 1:
        return <PropertyDetails />;
      case 2:
        return <PropertyLocation />;
      case 3:
        return <PropertyPricing />;
      case 4:
        return <PropertyFeatures />;
      case 5:
        return <PropertyOwnerInfo />;
      case 6:
        return (
          <Card>
            <CardContent className="pt-6">
              <PropertyImageManager />
            </CardContent>
          </Card>
        );
      case 7:
        return <PropertyDocuments />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  return (
    <div className="md:hidden">
      <div className="text-lg font-semibold mb-4">
        {FormSteps[currentStepIndex]?.label || 'Property Form'}
      </div>
      
      {renderStepContent()}
    </div>
  );
};

export default MobileFormStepsView;
