import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Grid2X2, Home, Building, MapPin, Tag } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';
import { supabase } from '@/integrations/supabase/client';

// Get public URL for a storage path
const getImageUrl = (storage_path: string | null) => {
  if (!storage_path) return '/placeholder.svg';
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(storage_path);
    
  return data?.publicUrl || '/placeholder.svg';
};

interface PropertyCardProps {
  property: any; // Using any temporarily, should be properly typed
  showFullDetails?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showFullDetails = false }) => {
  // Get the property type name
  const propertyType = property.property_types?.name || property.propertyType || 'Residential';
  
  // Get the transaction type name
  const transactionType = property.transaction_types?.name || property.transactionType || 'Sale';
  
  // Get the property status
  const status = property.property_statuses?.name || property.status || 'Available';
  
  // Find the cover image or use the first image
  const coverImage = property.property_images?.find((img: any) => img.is_cover) || 
                    (property.property_images?.length > 0 ? property.property_images[0] : null);
  
  // Get image URL
  const imageUrl = coverImage ? getImageUrl(coverImage.storage_path) : '/placeholder.svg';
  
  // Format price based on transaction type
  const price = transactionType === 'Rent' || transactionType === 'Rental' 
                ? (property.rental_rate || property.rentalRate || 0) 
                : (property.price || 0);
  
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
          
          {status && (
            <Badge className="absolute top-2 right-2" variant={
              status === 'Available' ? 'default' :
              status === 'Sold' || status === 'Rented' ? 'destructive' :
              'secondary'
            }>
              {status}
            </Badge>
          )}
          
          {property.featured && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-yellow-500/80 text-white border-none">
              Featured
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
                {[property.city, property.state].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="ml-2 whitespace-nowrap">
            {transactionType}
          </Badge>
        </div>
        
        <div className="mt-3 text-lg font-bold">
          {formatCurrency(price)}
          {transactionType === 'Rent' || transactionType === 'Rental' ? '/month' : ''}
        </div>
        
        {showFullDetails && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {property.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 text-sm">
        {/* Show details based on property type */}
        {propertyType === 'Residential' && (
          <>
            {property.bedrooms && (
              <div className="flex items-center mr-3">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="flex items-center mr-3">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            
            {property.built_up_area && (
              <div className="flex items-center">
                <Grid2X2 className="h-4 w-4 mr-1" />
                <span>{property.built_up_area} sq.ft</span>
              </div>
            )}
          </>
        )}
        
        {(propertyType === 'Commercial' || propertyType === 'Industrial') && (
          <>
            {property.floor_area || property.land_area ? (
              <div className="flex items-center mr-3">
                <Building className="h-4 w-4 mr-1" />
                <span>{property.floor_area || property.land_area} sq.ft</span>
              </div>
            ) : null}
          </>
        )}
        
        {propertyType === 'Land' && property.land_size && (
          <div className="flex items-center">
            <Grid2X2 className="h-4 w-4 mr-1" />
            <span>{property.land_size} sq.ft</span>
          </div>
        )}
        
        <div className="flex items-center ml-auto">
          <Tag className="h-4 w-4 mr-1" />
          <span>{propertyType}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
