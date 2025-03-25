
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Grid2X2, Home, Building, MapPin, Tag, Package } from 'lucide-react';
import { formatCurrency, calculateStockPercentage, getStockStatusLabel } from '@/utils/propertyUtils';
import { Property } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  showFullDetails?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showFullDetails = false }) => {
  // Format status for display
  const formattedStatus = property.status ? 
    property.status.charAt(0).toUpperCase() + property.status.slice(1) : 
    'Available';
  
  // Get image URL or fallback
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : '/placeholder.svg';
  
  // Check if this is a development with stock
  const isDevelopment = property.stock && property.stock.total > 1;
  
  // Calculate stock percentage if this is a development
  const stockPercentage = isDevelopment && property.stock ? 
    calculateStockPercentage(property.stock.available, property.stock.total) : 
    null;
  
  // Get stock status label if this is a development
  const stockLabel = stockPercentage !== null ? 
    getStockStatusLabel(stockPercentage) : 
    null;
  
  // Handle click for analytics (to be implemented)
  const handlePropertyClick = () => {
    console.log('Property clicked:', property.id);
    // Track click analytics here
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/properties/${property.id}`} onClick={handlePropertyClick}>
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          
          {/* Status badge - Always shown */}
          <Badge className="absolute top-2 right-2" variant={
            formattedStatus.toLowerCase() === 'available' ? 'default' :
            formattedStatus.toLowerCase() === 'sold' || formattedStatus.toLowerCase() === 'rented' ? 'destructive' :
            'secondary'
          }>
            {formattedStatus}
          </Badge>
          
          {/* Featured badge */}
          {property.featured && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-yellow-500/80 text-white border-none">
              Featured
            </Badge>
          )}
          
          {/* Stock badge - Only shown for developments with stock */}
          {isDevelopment && stockLabel && property.stock && (
            <Badge 
              variant="outline" 
              className={cn(
                "absolute bottom-2 right-2 flex items-center gap-1",
                stockPercentage === 0 ? "bg-red-500/80 border-none text-white" :
                stockPercentage <= 25 ? "bg-orange-500/80 border-none text-white" :
                stockPercentage <= 50 ? "bg-yellow-500/80 border-none text-white" :
                stockPercentage <= 75 ? "bg-blue-500/80 border-none text-white" :
                "bg-green-500/80 border-none text-white"
              )}
            >
              <Package className="h-3 w-3" />
              {stockLabel}
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="line-clamp-1">
                {[property.address?.city, property.address?.state].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="ml-2 whitespace-nowrap capitalize">
            {property.transactionType || 'Sale'}
          </Badge>
        </div>
        
        <div className="mt-3 text-lg font-bold">
          {formatCurrency(property.price)}
          {(property.transactionType.toLowerCase() === 'rent' || property.transactionType.toLowerCase() === 'rental') ? '/month' : ''}
        </div>
        
        {/* Stock information for developments */}
        {isDevelopment && property.stock && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            <span>{property.stock.available} of {property.stock.total} units available</span>
          </div>
        )}
        
        {showFullDetails && property.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {property.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 text-sm">
        {/* Show details based on property type */}
        {property.type.toLowerCase() === 'residential' && (
          <>
            {property.features?.bedrooms > 0 && (
              <div className="flex items-center mr-3">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.features.bedrooms} {property.features.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            
            {property.features?.bathrooms > 0 && (
              <div className="flex items-center mr-3">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.features.bathrooms} {property.features.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            
            {property.features?.squareFeet > 0 && (
              <div className="flex items-center">
                <Grid2X2 className="h-4 w-4 mr-1" />
                <span>{property.features.squareFeet} sq.ft</span>
              </div>
            )}
          </>
        )}
        
        {(property.type.toLowerCase() === 'commercial' || property.type.toLowerCase() === 'industrial') && (
          <>
            {property.features?.squareFeet > 0 && (
              <div className="flex items-center mr-3">
                <Building className="h-4 w-4 mr-1" />
                <span>{property.features.squareFeet} sq.ft</span>
              </div>
            )}
          </>
        )}
        
        {property.type.toLowerCase() === 'land' && property.features?.landSize > 0 && (
          <div className="flex items-center">
            <Grid2X2 className="h-4 w-4 mr-1" />
            <span>{property.features.landSize} sq.ft</span>
          </div>
        )}
        
        <div className="flex items-center ml-auto">
          <Tag className="h-4 w-4 mr-1" />
          <span className="capitalize">{property.type}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
