
import React from 'react';
import { Property } from '@/types';

interface PropertyMapProps {
  properties: Property[];
}

export const PropertyMap: React.FC<PropertyMapProps> = () => {
  return (
    <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center">
      <p className="text-center text-muted-foreground">
        Map view is currently under development
      </p>
    </div>
  );
};
