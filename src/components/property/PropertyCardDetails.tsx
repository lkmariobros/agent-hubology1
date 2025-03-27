
import React from 'react';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, MapPin, Calendar, Tag, Building, User } from 'lucide-react';
import { formatPrice } from '@/utils/propertyUtils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
}

export const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({ property, onEdit }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Property Details */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-neutral-400">Property Details</h4>
        <div className="grid grid-cols-2 gap-3">
          {property.bedrooms && (
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{property.bedrooms} Bedrooms</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{property.bathrooms} Bathrooms</span>
            </div>
          )}
          
          {property.area && (
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{property.area} sq ft</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <span className="text-sm truncate">{property.address.city}, {property.address.state}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-neutral-400" />
            <span className="text-sm">${formatPrice(property.price)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-neutral-400" />
            <span className="text-sm capitalize">{property.type}</span>
          </div>
          
          {property.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{format(new Date(property.createdAt), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {property.agent && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{property.agent.firstName} {property.agent.lastName}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-neutral-400">Features</h4>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="bg-neutral-800/50 text-neutral-200 border-neutral-700">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-neutral-400">Description</h4>
        <p className="text-sm text-neutral-300 line-clamp-3">{property.description}</p>
      </div>
      
      {/* Actions */}
      <div className="pt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>View Details</Button>
        {property.status === 'available' && (
          <Button size="sm">Contact Agent</Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(property.id)}>
            Edit Property
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyCardDetails;
