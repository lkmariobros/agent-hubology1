
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Grid2X2, Square, MapPin, Tag, Package, Home, Building } from 'lucide-react';
import { formatCurrency, formatPrice, getStockStatusLabelFromPercentage } from '@/utils/propertyUtils';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

interface PropertyCardProps {
  property: Property;
  showFullDetails?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  showFullDetails = false,
  isLoading = false,
  onClick,
  className = ''
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
        <div className="h-48 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <CardContent className="p-4">
          <LoadingIndicator size="sm" text="Loading property..." />
        </CardContent>
      </Card>
    );
  }
  
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
    Math.round((property.stock.available / property.stock.total) * 100) : 
    null;
  
  // Get stock status label if this is a development
  const stockLabel = stockPercentage !== null ? 
    getStockStatusLabelFromPercentage(stockPercentage) : 
    null;
  
  // Handle click for analytics
  const handlePropertyClick = () => {
    console.log('Property clicked:', property.id);
    if (onClick) onClick();
  };

  // Helper to safely access features 
  const getFeatureValue = (key: string, defaultValue: number = 0): number => {
    if (!property.features) return defaultValue;
    
    if (Array.isArray(property.features)) {
      return defaultValue;
    }
    
    return (property.features as any)[key] || defaultValue;
  };

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link to={`/properties/${property.id}`} onClick={handlePropertyClick}>
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          
          {/* Status badge - Always shown */}
          <Badge className="absolute top-2 left-2" variant={
            formattedStatus.toLowerCase() === 'available' ? 'default' :
            formattedStatus.toLowerCase() === 'sold' || formattedStatus.toLowerCase() === 'rented' ? 'destructive' :
            'secondary'
          }>
            {formattedStatus}
          </Badge>
          
          {/* Featured badge */}
          {property.featured && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-yellow-500/80 text-white border-none">
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
          {formatPrice(property.price)}
          {(property.transactionType?.toLowerCase() === 'rent' || property.transactionType?.toLowerCase() === 'rental') ? '/month' : ''}
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
        {(!property.type || property.type.toLowerCase() === 'residential') && (
          <>
            {getFeatureValue('bedrooms') > 0 && (
              <div className="flex items-center mr-3">
                <Bed className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('bedrooms')} {getFeatureValue('bedrooms') === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            
            {getFeatureValue('bathrooms') > 0 && (
              <div className="flex items-center mr-3">
                <Bath className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('bathrooms')} {getFeatureValue('bathrooms') === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            
            {getFeatureValue('squareFeet') > 0 && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('squareFeet')} sq.ft</span>
              </div>
            )}
          </>
        )}
        
        {property.type && (property.type.toLowerCase() === 'commercial' || property.type.toLowerCase() === 'industrial') && (
          <>
            {getFeatureValue('squareFeet') > 0 && (
              <div className="flex items-center mr-3">
                <Building className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('squareFeet')} sq.ft</span>
              </div>
            )}
          </>
        )}
        
        {property.type && property.type.toLowerCase() === 'land' && getFeatureValue('landSize') > 0 && (
          <div className="flex items-center">
            <Grid2X2 className="h-4 w-4 mr-1" />
            <span>{getFeatureValue('landSize')} sq.ft</span>
          </div>
        )}
        
        <div className="flex items-center ml-auto">
          <Tag className="h-4 w-4 mr-1" />
          <span className="capitalize">{property.type || 'Residential'}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
