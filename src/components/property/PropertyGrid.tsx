
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Bed, Bath, Square, Star, MapPin, Building2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Property } from '@/types';
import { getPublicImageUrl } from '@/integrations/supabase/storage';

interface PropertyGridProps {
  properties: Property[];
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  const navigate = useNavigate();
  
  // If no properties, display a message
  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No properties found.</p>
      </div>
    );
  }
  
  const handlePropertyClick = (id: string) => {
    navigate(`/properties/${id}`);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties.map((property, index) => {
        // Get the first image or use a placeholder
        const coverImage = property.images && property.images.length > 0 
          ? property.images[0] 
          : null;
          
        // Check if the image is a Supabase path (starts with property-images/)
        let imageUrl = '';
        if (coverImage) {
          imageUrl = coverImage.startsWith('property-images/') 
            ? getPublicImageUrl(coverImage) 
            : coverImage;
        }
        
        return (
          <motion.div 
            key={property.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="cursor-pointer"
            onClick={() => handlePropertyClick(property.id)}
          >
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
              <div className="relative">
                <div className="aspect-video bg-muted overflow-hidden">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 left-2 flex space-x-2">
                  <Badge className={
                    property.status === 'Available' || property.status === 'available' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : property.status === 'Pending' || property.status === 'pending' 
                        ? 'bg-yellow-500 hover:bg-yellow-600' 
                        : 'bg-red-500 hover:bg-red-600'
                  }>
                    {property.status}
                  </Badge>
                </div>
                {property.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">
                      {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="font-bold text-lg">{formatCurrency(property.price)}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t bg-muted/50">
                <div className="grid grid-cols-3 gap-2 w-full">
                  {property.features?.bedrooms && (
                    <div className="flex items-center text-xs">
                      <Bed className="h-3 w-3 mr-1" />
                      <span>{property.features.bedrooms} Beds</span>
                    </div>
                  )}
                  {property.features?.bathrooms && (
                    <div className="flex items-center text-xs">
                      <Bath className="h-3 w-3 mr-1" />
                      <span>{property.features.bathrooms} Baths</span>
                    </div>
                  )}
                  {property.features?.squareFeet && (
                    <div className="flex items-center text-xs">
                      <Square className="h-3 w-3 mr-1" />
                      <span>{property.features.squareFeet} ft²</span>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PropertyGrid;
