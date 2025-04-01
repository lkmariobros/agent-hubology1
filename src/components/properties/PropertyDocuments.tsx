
import React from 'react';

interface PropertyDocumentsProps {
  propertyId: string;
}

const PropertyDocuments: React.FC<PropertyDocumentsProps> = ({ propertyId }) => {
  return (
    <div>
      <p>Property Documents for ID: {propertyId}</p>
      <p>This is a stub component that will list all documents related to this property.</p>
    </div>
  );
};

export default PropertyDocuments;
