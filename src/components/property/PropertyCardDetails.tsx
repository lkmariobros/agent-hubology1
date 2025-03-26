import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Grid2X2, Home, Building, MapPin, Tag, Package, Calendar } from 'lucide-react';
import { formatCurrency, calculateStockPercentage, getStockStatusLabel } from '@/utils/propertyUtils';
import { Property, PropertyStock } from '@/types';

interface PropertyCardDetailsProps {
  property: Property;
}

export const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({ property }) => {
  // Format status for display
  const formattedStatus = property.status ?
    property.status.charAt(0).toUpperCase() + property.status.slice(1) :
    'Available';

  // Get image URL or fallback
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : '/placeholder.svg';

  // Check if this is a development with stock
  const isDevelopment = property.stock && property.stock > 1;

  // Calculate stock percentage if this is a development
  const stockPercentage = isDevelopment && property.stock ?
    calculateStockPercentage(property.stock, property.stock) :
    null;

  // Get stock status label if this is a development
  const stockLabel = stockPercentage !== null ?
    getStockStatusLabel(stockPercentage) :
    null;

  // Helper to safely access features
  const getFeatureValue = (key: string, defaultValue: number = 0): number => {
    if (!property.features) return defaultValue;

    if (Array.isArray(property.features)) {
      return defaultValue;
    }

    return (property.features as any)[key] || defaultValue;
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/properties/${property.id}`}>
        <div className="relative">
          <div className="h-64 overflow-hidden">
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
              className="absolute bottom-2 right-2 flex items-center gap-1"
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
          {(property.transactionType?.toLowerCase() === 'rent' || property.transactionType?.toLowerCase() === 'rental') ? '/month' : ''}
        </div>

        {/* Stock information for developments */}
        {isDevelopment && property.stock && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            <span>{property.stock} units available</span>
          </div>
        )}

        {property.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {property.description}
          </p>
        )}

        {property.listedBy && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Listed by: {property.listedBy}</span>
          </div>
        )}
      </CardContent>

      {/* Property Details Section */}
      <CardHeader className="p-4">
        <CardTitle>Property Details</CardTitle>
        <CardDescription>
          Explore the unique features of this property.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex flex-wrap gap-2 text-sm">
        {/* Show details based on property type */}
        {property.type.toLowerCase() === 'residential' && (
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
                <Grid2X2 className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('squareFeet')} sq.ft</span>
              </div>
            )}
          </>
        )}

        {(property.type.toLowerCase() === 'commercial' || property.type.toLowerCase() === 'industrial') && (
          <>
            {getFeatureValue('squareFeet') > 0 && (
              <div className="flex items-center mr-3">
                <Building className="h-4 w-4 mr-1" />
                <span>{getFeatureValue('squareFeet')} sq.ft</span>
              </div>
            )}
          </>
        )}

        {property.type.toLowerCase() === 'land' && getFeatureValue('landSize') > 0 && (
          <div className="flex items-center">
            <Grid2X2 className="h-4 w-4 mr-1" />
            <span>{getFeatureValue('landSize')} sq.ft</span>
          </div>
        )}

        <div className="flex items-center ml-auto">
          <Tag className="h-4 w-4 mr-1" />
          <span className="capitalize">{property.type}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCardDetails;
