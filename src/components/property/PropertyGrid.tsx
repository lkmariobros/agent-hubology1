
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { ExpandablePropertyCard } from './ExpandablePropertyCard';
import { toast } from 'sonner';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  const navigate = useNavigate();

  const handleEditProperty = (id: string) => {
    navigate(`/properties/${id}/edit`);
  };

  const handleFavoriteProperty = (id: string) => {
    toast.success(`Property ${id} added to favorites`);
  };

  const handleShareProperty = (id: string) => {
    toast.success(`Share link for property ${id} copied to clipboard`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
      {properties.length > 0 ? (
        properties.map(property => (
          <div key={property.id} className="relative overflow-visible flex flex-col">
            <ExpandablePropertyCard
              property={property}
              onFavorite={handleFavoriteProperty}
              onShare={handleShareProperty}
              onEdit={handleEditProperty}
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
