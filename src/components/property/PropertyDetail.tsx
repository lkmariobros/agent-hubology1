
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Home,
  Square, 
  Bed, 
  Bath,
  Building2, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { getPublicImageUrl } from '@/integrations/supabase/storage';

interface PropertyDetailProps {
  property: Property;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ 
  property,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  
  // Process images to get proper URLs if they're from Supabase
  const processedImages = property.images.map(img => {
    if (typeof img === 'string' && img.startsWith('property-images/')) {
      return getPublicImageUrl(img);
    }
    return img;
  });
  
  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
  };
  
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % processedImages.length);
  };
  
  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + processedImages.length) % processedImages.length);
  };
  
  return (
    <div className="space-y-4">
      {/* Header with navigation and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/properties')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* First Row: Property Images and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Image gallery */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* Main image with status badges */}
            <div className="relative rounded-lg overflow-hidden h-[400px] bg-muted">
              {processedImages && processedImages.length > 0 ? (
                <img 
                  src={processedImages[activeImage]} 
                  alt={property.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <Building2 className="h-24 w-24 text-muted-foreground opacity-20" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex space-x-2">
                <Badge className={property.status === 'Available' ? 'bg-green-500 hover:bg-green-600' : 
                          property.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          'bg-red-500 hover:bg-red-600'}>
                  {property.status}
                </Badge>
                <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                  {property.type}
                </Badge>
              </div>
              
              {/* Image navigation arrows */}
              {processedImages.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {processedImages && processedImages.length > 0 && (
              <div className="grid grid-cols-6 gap-2 overflow-x-auto">
                {processedImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`h-20 relative rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Property details */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 space-y-4">
              {/* Title and location */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <p className="text-sm">
                    {property.address.street}, {property.address.city}, {property.address.state}
                  </p>
                </div>
              </div>
              
              {/* Price and updated date */}
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(property.price)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Updated {formatDate(property.updatedAt)}</span>
                </div>
              </div>
              
              {/* Property specifications grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Area</span>
                  </div>
                  <span className="text-lg mt-1">
                    {property.features.squareFeet} sqft
                  </span>
                </div>
                
                <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <span className="text-lg mt-1">
                    {property.subtype || property.type}
                  </span>
                </div>
                
                {property.features.bedrooms > 0 && (
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Bedrooms</span>
                    </div>
                    <span className="text-lg mt-1">
                      {property.features.bedrooms}
                    </span>
                  </div>
                )}
                
                {property.features.bathrooms > 0 && (
                  <div className="flex flex-col p-3 rounded-md bg-secondary/50">
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Bathrooms</span>
                    </div>
                    <span className="text-lg mt-1">
                      {property.features.bathrooms}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <div className="text-sm text-muted-foreground">
                  {property.description || 'No description available.'}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-4 space-y-2">
                <Button className="w-full">Contact Agent</Button>
                <Button variant="outline" className="w-full">
                  View More Details
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
