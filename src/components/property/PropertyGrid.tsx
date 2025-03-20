import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { ExpandablePropertyCard } from './ExpandablePropertyCard';
import { toast } from 'sonner';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  const navigate = useNavigate();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleEditProperty = (id: string) => {
    navigate(`/properties/${id}/edit`);
  };

  const handleFavoriteProperty = (id: string) => {
    toast.success(`Property ${id} added to favorites`);
  };

  const handleShareProperty = (id: string) => {
    toast.success(`Share link for property ${id} copied to clipboard`);
  };

  // This function handles the expansion toggle of a card
  const handleCardExpand = (id: string, isExpanded: boolean) => {
    setExpandedCardId(isExpanded ? id : null);
  };

  // Calculate grid layout based on the expanded card
  const getGridLayoutClasses = (index: number, columnCount: number) => {
    // Calculate which column this item belongs to
    const column = index % columnCount;
    
    // Calculate grid positioning classes based on column
    return `col-span-1 col-start-${column + 1}`;
  };

  // Determine column count based on screen size
  const getColumnCount = () => {
    // This should match the grid-cols-X values in the parent grid
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return 3; // xl
      if (width >= 1024) return 3; // lg
      if (width >= 640) return 2; // sm
      return 1; // base
    }
    return 3; // Default to 3 columns for SSR
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
      {properties.length > 0 ? (
        properties.map((property, index) => (
          <div 
            key={property.id} 
            className="relative overflow-visible flex flex-col"
          >
            <ExpandablePropertyCard
              property={property}
              onFavorite={handleFavoriteProperty}
              onShare={handleShareProperty}
              onEdit={handleEditProperty}
              onExpand={(isExpanded) => handleCardExpand(property.id, isExpanded)}
              isExpanded={expandedCardId === property.id}
            />
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground py-12">
          No properties to display. Add a new property to get started.
        </p>
      )}
    </div>
  );
};
