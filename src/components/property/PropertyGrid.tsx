
import React, { useState, useEffect } from 'react';
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
  
  // Update column count based on current viewport
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1536) { // 2xl
        setColumnCount(3);
      } else if (window.innerWidth >= 1024) { // lg
        setColumnCount(2);
      } else if (window.innerWidth >= 768) { // md
        setColumnCount(2);
      } else {
        setColumnCount(1);
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

  // Organize properties into columns based on the current column count
  const organizeIntoColumns = () => {
    const columns: Property[][] = Array.from({ length: columnCount }, () => []);
    
    properties.forEach((property, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(property);
    });
    
    return columns;
  };

  const columns = organizeIntoColumns();

  if (properties.length === 0) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground py-12">
          No properties to display. Add a new property to get started.
        </p>
      </div>
    );
  }

  // Removed the additional border by applying the grid directly in the parent div
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {properties.map((property) => (
        <div key={property.id} className="w-full">
          <ExpandablePropertyCard
            property={property}
            onFavorite={handleFavoriteProperty}
            onShare={handleShareProperty}
            onEdit={handleEditProperty}
            onExpand={(isExpanded) => handleCardExpand(property.id, isExpanded)}
            isExpanded={expandedCardId === property.id}
          />
        </div>
      ))}
    </div>
  );
}
