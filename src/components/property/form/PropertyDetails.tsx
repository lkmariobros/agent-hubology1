
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { usePropertyType } from '@/hooks/usePropertyType';
import PropertyResidentialDetails from './PropertyResidentialDetails';
import PropertyCommercialDetails from './PropertyCommercialDetails';
import PropertyIndustrialDetails from './PropertyIndustrialDetails';
import PropertyLandDetails from './PropertyLandDetails';

const PropertyDetails: React.FC = () => {
  const { state } = usePropertyForm();
  const { formData } = state;
  const propertyType = formData.propertyType;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {propertyType === 'Residential' && <PropertyResidentialDetails />}
          {propertyType === 'Commercial' && <PropertyCommercialDetails />}
          {propertyType === 'Industrial' && <PropertyIndustrialDetails />}
          {propertyType === 'Land' && <PropertyLandDetails />}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
