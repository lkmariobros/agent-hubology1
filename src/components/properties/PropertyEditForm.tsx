
import React from 'react';
import { Button } from '@/components/ui/button';

interface PropertyEditFormProps {
  property: any;
  onComplete: () => void;
  onCancel: () => void;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ property, onComplete, onCancel }) => {
  return (
    <div>
      <p>Edit Form for Property: {property.id}</p>
      <p>This is a stub component that will allow editing of property details.</p>
      <div className="flex gap-2 mt-4">
        <Button onClick={onComplete}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default PropertyEditForm;
