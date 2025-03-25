
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import PropertyCardDetails from './PropertyCardDetails';

interface ExpandablePropertyCardProps {
  property: Property;
  className?: string;
}

const ExpandablePropertyCard: React.FC<ExpandablePropertyCardProps> = ({ 
  property, 
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  return (
    <Card className={cn('overflow-hidden transition-all duration-200', className)}>
      <CardContent className="p-0">
        <div 
          className="p-4 cursor-pointer flex justify-between items-center"
          onClick={toggleExpand}
        >
          <h3 className="font-medium text-lg truncate">{property.title}</h3>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        
        <div className={cn(
          "transition-all duration-200 max-h-0 overflow-hidden",
          isExpanded && "max-h-[1000px]" // Set a large enough value to accommodate content
        )}>
          <PropertyCardDetails property={property} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandablePropertyCard;
