
import React from 'react';
import { BedIcon, BathIcon, RulerIcon, HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardDetailsProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  className?: string;
}

// Helper function to format area
const formatArea = (area: number): string => {
  return `${area.toLocaleString()} sq ft`;
};

const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({
  bedrooms,
  bathrooms,
  area,
  propertyType,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-4 gap-2 text-sm", className)}>
      <div className="flex flex-col items-center">
        <BedIcon className="h-4 w-4 mb-1 text-muted-foreground" />
        <span>{bedrooms} Beds</span>
      </div>
      <div className="flex flex-col items-center">
        <BathIcon className="h-4 w-4 mb-1 text-muted-foreground" />
        <span>{bathrooms} Baths</span>
      </div>
      <div className="flex flex-col items-center">
        <RulerIcon className="h-4 w-4 mb-1 text-muted-foreground" />
        <span>{formatArea(area)}</span>
      </div>
      <div className="flex flex-col items-center">
        <HomeIcon className="h-4 w-4 mb-1 text-muted-foreground" />
        <span>{propertyType}</span>
      </div>
    </div>
  );
};

export default PropertyCardDetails;
