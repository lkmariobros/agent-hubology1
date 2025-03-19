
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Store, Factory, Map } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  const navigate = useNavigate();

  const getPropertyTypeIcon = (type: string) => {
    switch(type) {
      case 'residential':
        return <Building2 className="h-4 w-4" />;
      case 'commercial':
        return <Store className="h-4 w-4" />;
      case 'industrial':
        return <Factory className="h-4 w-4" />;
      case 'land':
        return <Map className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `RM ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `RM ${(price / 1000).toFixed(0)}K`;
    }
    return `RM ${price}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {properties.length > 0 ? (
        properties.map(property => (
          <div 
            key={property.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <div className="relative h-40 bg-muted">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getPropertyTypeIcon(property.type)}
                </div>
              )}
              <Badge
                className="absolute top-2 right-2"
                variant={property.status === 'available' ? 'default' : 'outline'}
              >
                {property.status}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-medium truncate">{property.title}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3" />
                <span>{property.address.city}, {property.address.state}</span>
              </div>
              <div className="mt-2 font-medium">{formatPrice(property.price)}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-3">
                {property.bedrooms && (
                  <span>{property.bedrooms} bd</span>
                )}
                {property.bathrooms && (
                  <span>{property.bathrooms} ba</span>
                )}
                {property.area && (
                  <span>{property.area} ft²</span>
                )}
              </div>
            </div>
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
