
import React, { useState, useEffect, useRef } from 'react';
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
  const [columnCount, setColumnCount] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  // Update column count based on current viewport
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(3); // lg and above
      } else if (window.innerWidth >= 640) {
        setColumnCount(2); // sm to lg
      } else {
        setColumnCount(1); // xs
      }
    };

    // Set initial column count
    updateColumnCount();

    // Update column count when window is resized
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

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

  // Get the column index for a specific card
  const getColumnIndex = (index: number) => index % columnCount;

  // Calculate which cards should be pushed down
  const calculateLayout = (index: number) => {
    if (!expandedCardId) return 0;
    
    const expandedIndex = properties.findIndex(p => p.id === expandedCardId);
    if (expandedIndex === -1) return 0;
    
    const expandedColumnIndex = getColumnIndex(expandedIndex);
    const currentColumnIndex = getColumnIndex(index);
    
    // Only push down cards that are in the same column AND below the expanded card
    if (currentColumnIndex === expandedColumnIndex && index > expandedIndex) {
      return 150; // Extra space needed for expanded content
    }
    
    return 0;
  };

  return (
    <div 
      ref={gridRef} 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6 relative"
    >
      {properties.length > 0 ? (
        properties.map((property, index) => {
          const extraMargin = calculateLayout(index);
          
          return (
            <div 
              key={property.id} 
              className="relative overflow-visible z-auto"
              style={{
                isolation: 'isolate',
                marginTop: extraMargin ? `${extraMargin}px` : '0',
                transition: 'margin-top 0.3s ease-in-out'
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
