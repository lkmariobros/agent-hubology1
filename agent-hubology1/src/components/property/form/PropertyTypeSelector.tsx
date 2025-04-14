
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Building, Home, Factory, Landmark } from 'lucide-react';

const PropertyTypeSelector: React.FC = () => {
  const { state, updatePropertyType } = usePropertyForm();
  const selectedType = state.formData.propertyType;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Property Type</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          type="button"
          variant={selectedType === 'Residential' ? 'default' : 'outline'}
          className="flex flex-col h-24 gap-2 items-center justify-center"
          onClick={() => updatePropertyType('Residential')}
        >
          <Home className="h-6 w-6" />
          <span>Residential</span>
        </Button>

        <Button
          type="button"
          variant={selectedType === 'Commercial' ? 'default' : 'outline'}
          className="flex flex-col h-24 gap-2 items-center justify-center"
          onClick={() => updatePropertyType('Commercial')}
        >
          <Building className="h-6 w-6" />
          <span>Commercial</span>
        </Button>

        <Button
          type="button"
          variant={selectedType === 'Industrial' ? 'default' : 'outline'}
          className="flex flex-col h-24 gap-2 items-center justify-center"
          onClick={() => updatePropertyType('Industrial')}
        >
          <Factory className="h-6 w-6" />
          <span>Industrial</span>
        </Button>

        <Button
          type="button"
          variant={selectedType === 'Land' ? 'default' : 'outline'}
          className="flex flex-col h-24 gap-2 items-center justify-center"
          onClick={() => updatePropertyType('Land')}
        >
          <Landmark className="h-6 w-6" />
          <span>Land</span>
        </Button>
      </div>
    </div>
  );
};

export default PropertyTypeSelector;
