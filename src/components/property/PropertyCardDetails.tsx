
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BedDouble, 
  Bath, 
  SquareFeet, 
  Heart, 
  Share2,
  Home,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { Property } from '@/types/property';
import { formatCurrency } from '@/utils/format';
import { PropertyStock } from '@/types';

interface PropertyCardDetailsProps {
  property: Property;
  stock?: PropertyStock;
  showActions?: boolean;
  isExpanded?: boolean;
}

const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({ 
  property, 
  stock,
  showActions = true,
  isExpanded = false
}) => {
  // Format price for display
  const formattedPrice = formatCurrency(property.price);
  
  // Format address if available
  const formatAddress = () => {
    if (!property.address) return 'Address not available';
    
    const { street, city, state, zip, country } = property.address;
    const addressParts = [street, city, state, zip, country].filter(Boolean);
    return addressParts.join(', ');
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        {/* Top Section - Property type and price */}
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20"
            >
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
            {property.subtype && (
              <Badge 
                variant="outline" 
                className="ml-2 bg-muted/50"
              >
                {property.subtype}
              </Badge>
            )}
            {property.status && (
              <Badge 
                variant={property.status.toLowerCase() === 'available' ? 'success' : 'outline'}
                className="ml-2"
              >
                {property.status}
              </Badge>
            )}
          </div>
          <div className="text-xl font-bold">{formattedPrice}</div>
        </div>
        
        {/* Property Title */}
        {!isExpanded && (
          <h3 className="text-lg font-medium line-clamp-2">{property.title}</h3>
        )}
        
        {/* Property Details */}
        <div className="flex flex-wrap gap-6">
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
          )}
          
          {property.size !== undefined && (
            <div className="flex items-center gap-1">
              <SquareFeet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.size} sqft</span>
            </div>
          )}
        </div>
        
        {/* Address if available */}
        {property.address && (
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{formatAddress()}</span>
          </div>
        )}
        
        {/* Stock Information if provided */}
        {stock && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-medium">{stock.total}</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-xs text-green-600">Available</div>
              <div className="font-medium text-green-700">{stock.available}</div>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded">
              <div className="text-xs text-amber-600">Reserved</div>
              <div className="font-medium text-amber-700">{stock.reserved}</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-xs text-red-600">Sold</div>
              <div className="font-medium text-red-700">{stock.sold}</div>
            </div>
          </div>
        )}
        
        {/* Expanded Details - only shown when isExpanded is true */}
        {isExpanded && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{property.description}</p>
              </div>
              
              {property.features && property.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/30">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm">
                {property.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                
                {property.listedBy && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Agent: {typeof property.listedBy === 'string' ? property.listedBy : property.listedBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" className="flex-1 flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCardDetails;
