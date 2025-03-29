
import React from 'react';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, MapPin, Calendar, Tag, Building, User, Award, Link as LinkIcon, Check, Info } from 'lucide-react';
import { formatPrice } from '@/utils/propertyUtils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
  isLoading?: boolean;
  compact?: boolean;
  className?: string;
}

export const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({ 
  property, 
  onEdit,
  isLoading = false,
  compact = false,
  className = ''
}) => {
  const navigate = useNavigate();

  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn("p-4 space-y-4 animate-pulse", className)}>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20" />
            </div>
          ))}
        </div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2" />
        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    );
  }

  const handleViewDetails = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div className={cn("p-4 space-y-4", className)}>
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
          
          {property.address && (property.address.city || property.address.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              <span className="text-sm truncate">
                {[property.address.city, property.address.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          
          {property.price && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">${formatPrice(property.price)}</span>
            </div>
          )}
          
          {property.type && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-neutral-400" />
              <span className="text-sm capitalize">{property.type}</span>
            </div>
          )}
          
          {property.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">{format(new Date(property.createdAt), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {property.agent && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">
                {property.agent.firstName || property.agent.firstName} {property.agent.lastName}
              </span>
            </div>
          )}
          
          {!compact && property.featured && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Featured Property</span>
            </div>
          )}
          
          {!compact && property.reference && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-neutral-400" />
              <span className="text-sm">Ref: {property.reference}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Features */}
      {!compact && property.features && property.features.length > 0 && (
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
        <p className={cn(
          "text-sm text-neutral-300", 
          compact ? "line-clamp-2" : "line-clamp-3"
        )}>
          {property.description || "No description available"}
        </p>
      </div>
      
      {/* Actions */}
      <div className="pt-2 flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleViewDetails}>
                View Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View complete property information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {onEdit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => onEdit(property.id)}>
                  Edit Property
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit property details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default PropertyCardDetails;
