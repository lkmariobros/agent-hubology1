
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PropertyAddress from './PropertyAddress';

const PropertyLocation: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Property Location</h3>
          
          <PropertyAddress />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocation;
