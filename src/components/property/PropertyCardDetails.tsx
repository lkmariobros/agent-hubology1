
import React from 'react';
import { BedIcon, BathIcon, RulerIcon, HomeIcon, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Property } from '@/types';

interface PropertyCardDetailsProps {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
  className?: string;
  property?: Property;
  onEdit?: (id: string) => void;
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
  property,
  onEdit
}) => {
  // Use either direct props or property object
  const bedroomsValue = bedrooms ?? property?.bedrooms ?? 0;
  const bathroomsValue = bathrooms ?? property?.bathrooms ?? 0;
  const areaValue = area ?? property?.area ?? 0;
  const propertyTypeValue = propertyType ?? property?.type ?? '';

  return (
    <div className="space-y-4 p-4">
      <div className={cn("grid grid-cols-4 gap-2 text-sm", className)}>
        <div className="flex flex-col items-center">
          <BedIcon className="h-4 w-4 mb-1 text-muted-foreground" />
          <span>{bedroomsValue} Beds</span>
        </div>
        <div className="flex flex-col items-center">
          <BathIcon className="h-4 w-4 mb-1 text-muted-foreground" />
          <span>{bathroomsValue} Baths</span>
        </div>
        <div className="flex flex-col items-center">
          <RulerIcon className="h-4 w-4 mb-1 text-muted-foreground" />
          <span>{formatArea(areaValue)}</span>
        </div>
        <div className="flex flex-col items-center">
          <HomeIcon className="h-4 w-4 mb-1 text-muted-foreground" />
          <span>{propertyTypeValue}</span>
        </div>
      </div>
      
      {property && onEdit && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(property.id)}
            className="text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit Property
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyCardDetails;
