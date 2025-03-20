
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Handle mouse down for drag-based image navigation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!property.images || property.images.length <= 1) return;
    
    setIsDragging(true);
    setStartX(e.clientX);
  };

  // Handle mouse move for drag-based image navigation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !property.images || property.images.length <= 1) return;
    
    const deltaX = e.clientX - startX;
    const threshold = 50; // Pixels needed to move to change image
    
    if (deltaX > threshold) {
      // Move to previous image
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
      setStartX(e.clientX);
    } else if (deltaX < -threshold) {
      // Move to next image
      setCurrentImageIndex(prev => 
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
      setStartX(e.clientX);
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to end dragging if cursor leaves the element
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking favorite
    setIsFavorited(!isFavorited);
    if (onFavorite) onFavorite(property.id);
  };

  return (
    <div className="w-full" ref={cardRef}>
      <Collapsible
        open={isOpen}
        onOpenChange={handleOpenChange}
        className="w-full"
      >
        <Card 
          className={cn(
            "transition-all duration-300 ease-in-out border border-neutral-800/60 bg-[#121212] overflow-hidden shadow-lg", 
            "rounded-xl",
            className
          )}
        >
          {/* Image section with 4:3 aspect ratio */}
          <div 
            className="aspect-[4/3] w-full overflow-hidden select-none" 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <PropertyCardHeader
              property={property}
              currentImageIndex={currentImageIndex}
              isFavorited={isFavorited}
              onFavoriteClick={handleFavoriteClick}
              onShare={(id) => {
                if (onShare) {
                  onShare(id);
                }
              }}
              isDragging={isDragging}
            />
          </div>
          
          {/* Main content wrapper with dark background and rounded corners */}
          <div className="bg-[#121212] rounded-b-xl overflow-hidden">
            {/* Basic info section - This will be clickable for expansion */}
            <PropertyCardBasicInfo 
              property={property} 
              isOpen={isOpen}
              onCardClick={() => handleOpenChange(!isOpen)}
            />
            
            {/* Expandable content */}
            <CollapsibleContent
              className={cn(
                "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
                "overflow-hidden"
              )}
            >
              <PropertyCardDetails 
                property={property}
                onEdit={onEdit}
              />
            </CollapsibleContent>
          </div>
        </Card>
      </Collapsible>
    </div>
  );
}
