
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6 relative">
      {properties.length > 0 ? (
        properties.map((property, index) => {
          // Determine if this card is after the expanded card in the same column
          const isAfterExpandedInSameColumn = (() => {
            if (!expandedCardId) return false;
            
            // Get expanded card index
            const expandedIndex = properties.findIndex(p => p.id === expandedCardId);
            if (expandedIndex === -1) return false;
            
            // Only affect cards in the same column
            const columnCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
            const currentColumn = index % columnCount;
            const expandedColumn = expandedIndex % columnCount;
            
            // Only affect cards below the expanded one
            return currentColumn === expandedColumn && index > expandedIndex;
          })();
          
          return (
            <div 
              key={property.id} 
              className="relative overflow-visible z-auto"
              style={{
                isolation: 'isolate',
                // Only apply margin to cards below the expanded one in the same column
                marginTop: isAfterExpandedInSameColumn ? '120px' : '0'
              }}
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
          );
        })
      ) : (
        <p className="col-span-full text-center text-muted-foreground py-12">
          No properties to display. Add a new property to get started.
        </p>
      )}
    </div>
  );
};
