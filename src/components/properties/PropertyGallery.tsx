
import React from 'react';

interface PropertyGalleryProps {
  propertyId: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ propertyId }) => {
  return (
    <div>
      <p>Property Gallery for ID: {propertyId}</p>
      <p>This is a stub component that will display property images.</p>
    </div>
  );
};

export default PropertyGallery;
