
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Home, Factory, Map } from 'lucide-react';

type PropertyType = 'Residential' | 'Commercial' | 'Industrial' | 'Land';

interface PropertyTypeSelectorProps {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant={value === 'Residential' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Residential')}
      >
        <Home className="h-5 w-5" />
        <span>Residential</span>
      </Button>
      
      <Button
        type="button"
        variant={value === 'Commercial' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Commercial')}
      >
        <Building className="h-5 w-5" />
        <span>Commercial</span>
      </Button>
      
      <Button
        type="button"
        variant={value === 'Industrial' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Industrial')}
      >
        <Factory className="h-5 w-5" />
        <span>Industrial</span>
      </Button>
      
      <Button
        type="button"
        variant={value === 'Land' ? "default" : "outline"}
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onChange('Land')}
      >
        <Map className="h-5 w-5" />
        <span>Land</span>
      </Button>
    </div>
  );
};

export default PropertyTypeSelector;
