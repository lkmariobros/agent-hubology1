
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Home, Warehouse, Landmark } from 'lucide-react';

type PropertyType = 'Residential' | 'Commercial' | 'Industrial' | 'Land';

interface PropertyTypeSelectorProps {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ value, onChange }) => {
  const propertyTypes: Array<{
    id: PropertyType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'Residential', label: 'Residential', icon: <Home className="h-5 w-5" /> },
    { id: 'Commercial', label: 'Commercial', icon: <Building className="h-5 w-5" /> },
    { id: 'Industrial', label: 'Industrial', icon: <Warehouse className="h-5 w-5" /> },
    { id: 'Land', label: 'Land', icon: <Landmark className="h-5 w-5" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {propertyTypes.map((type) => (
        <Button
          key={type.id}
          type="button"
          variant={value === type.id ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => onChange(type.id)}
        >
          {type.icon}
          <span>{type.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default PropertyTypeSelector;
