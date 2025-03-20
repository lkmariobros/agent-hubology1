
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { getPropertyTypeIcon } from '@/utils/propertyUtils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PropertyCardHeader } from './PropertyCardHeader';
import { PropertyCardBasicInfo } from './PropertyCardBasicInfo';
import { PropertyCardDetails } from './PropertyCardDetails';

interface ExpandablePropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  onExpand?: (isExpanded: boolean) => void;
  isExpanded?: boolean;
  className?: string;
}

export function ExpandablePropertyCard({ 
  property, 
  onFavorite, 
  onShare, 
  onEdit,
  onExpand,
  isExpanded = false,
  className = ''
}: ExpandablePropertyCardProps) {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Sync internal state with external control
  useEffect(() => {
    setIsOpen(isExpanded);
  }, [isExpanded]);

  // Notify parent component when expansion state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onExpand) {
      onExpand(open);
    }
  };

  // Function to cycle through images based on cursor position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!property.images || property.images.length <= 1) return;
    
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const position = (clientX - left) / width;
    const imageIndex = Math.min(
      Math.floor(position * property.images.length),
      property.images.length - 1
    );
    setCurrentImageIndex(imageIndex);
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) onFavorite(property.id);
  };

  return (
    <div className="w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={handleOpenChange}
        className="w-full"
      >
        <Card className={cn(
          "relative transition-all duration-300 border-0 bg-neutral-900 backdrop-blur-sm overflow-hidden", 
          isOpen ? "rounded-t-xl" : "rounded-xl",
          className
        )}>
          <AspectRatio ratio={4/3}>
            <PropertyCardHeader
              property={property}
              currentImageIndex={currentImageIndex}
              isFavorited={isFavorited}
              onFavoriteClick={handleFavoriteClick}
              onShare={onShare}
              onMouseMove={handleMouseMove}
            />
          </AspectRatio>
          
          <PropertyCardBasicInfo 
            property={property} 
            isOpen={isOpen}
          />
        </Card>
        
        <CollapsibleContent
          className={cn(
            "overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
            "rounded-b-xl bg-neutral-900 backdrop-blur-sm border-0 border-t border-neutral-800"
          )}
        >
          <PropertyCardDetails 
            property={property}
            onEdit={onEdit}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
