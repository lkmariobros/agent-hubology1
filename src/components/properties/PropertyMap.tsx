
import React from 'react';

interface PropertyMapProps {
  address: string;
  city: string;
  state: string;
  zip: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, city, state, zip }) => {
  return (
    <div>
      <p>Property Map for: {address}, {city}, {state} {zip}</p>
      <p>This is a stub component that will display a map of the property location.</p>
    </div>
  );
};

export default PropertyMap;
