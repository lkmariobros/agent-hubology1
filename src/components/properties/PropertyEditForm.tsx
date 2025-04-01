
import React from 'react';
import { Button } from '@/components/ui/button';
import { Property } from '@/hooks/useProperty';

interface PropertyEditFormProps {
  property: Property;
  onComplete: () => void;
  onCancel: () => void;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ 
  property, 
  onComplete, 
  onCancel 
}) => {
  return (
    <div className="space-y-4">
      <p>Property Edit Form (Stub Component)</p>
      <p>This is where you would edit the property with ID: {property.id}</p>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onComplete}>Save Changes</Button>
      </div>
    </div>
  );
};

export default PropertyEditForm;
