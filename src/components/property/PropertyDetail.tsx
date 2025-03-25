
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Bed, 
  Bath, 
  Grid2X2, 
  MapIcon, 
  Edit, 
  Trash2, 
  Share, 
  Heart, 
  Package, 
  External, 
  SquareCheck 
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency, getPropertyCoverImage, calculateStockPercentage, getStockStatusLabel } from '@/utils/propertyUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPublicImageUrl } from '@/integrations/supabase/storage';

interface PropertyDetailProps {
  property: Property;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onEdit, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // For development properties with stock
  const isDevelopment = property.stock && property.stock.total > 1;
  const stockPercentage = isDevelopment ? calculateStockPercentage(
    property.stock.available, 
    property.stock.total
  ) : null;
  
  // Format dates
  const formattedDate = new Date(property.createdAt).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Get cover image or first image as default selected image
  const coverImage = getPropertyCoverImage(property);
  if (!selectedImage && coverImage) {
    setSelectedImage(coverImage);
  }
  
  // Process images to get public URLs
  const processedImages = property.images?.map(image => {
    if (typeof image === 'string' && image.startsWith('property-images/')) {
      return getPublicImageUrl(image);
    }
    return image;
  }) || [];
  
  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {[
                property.address.street,
                property.address.city,
                property.address.state,
                property.address.zip,
                property.address.country
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      {/* Property Images and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={property.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {processedImages.length > 0 && (
            <div className="grid grid-cols-6 gap-2">
              {processedImages.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden border cursor-pointer transition-all ${
                    selectedImage === image ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Property Description */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>
          
          {/* Property Features */}
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                    {property.subtype && (
                      <div>
                        <p className="text-sm text-muted-foreground">Property Subtype</p>
                        <p className="font-medium">{property.subtype}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction Type</p>
                      <p className="font-medium">{property.transactionType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={
                        property.status.toLowerCase() === 'available' ? 'bg-green-500' : 
                        property.status.toLowerCase() === 'pending' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }>
                        {property.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Listed On</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                    
                    {/* Stock information for development projects */}
                    {isDevelopment && property.stock && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Units</p>
                          <p className="font-medium">{property.stock.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Available Units</p>
                          <p className="font-medium">{property.stock.available}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Availability</p>
                          <Badge className={
                            stockPercentage === 0 ? 'bg-red-500' :
                            stockPercentage <= 25 ? 'bg-orange-500' :
                            stockPercentage <= 50 ? 'bg-yellow-500' :
                            stockPercentage <= 75 ? 'bg-blue-500' :
                            'bg-green-500'
                          }>
                            {getStockStatusLabel(stockPercentage || 0)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="features">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.type.toLowerCase() === 'residential' && (
                        <>
                          <div className="flex items-center">
                            <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Bedrooms</p>
                              <p className="font-medium">{property.features?.bedrooms || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Bathrooms</p>
                              <p className="font-medium">{property.features?.bathrooms || 0}</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center">
                        <Grid2X2 className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {property.type.toLowerCase() === 'land' ? 'Land Size' : 'Built-up Area'}
                          </p>
                          <p className="font-medium">
                            {property.type.toLowerCase() === 'land' 
                              ? (property.features?.landSize || 0) 
                              : (property.features?.squareFeet || 0)
                            } sq.ft
                          </p>
                        </div>
                      </div>
                      
                      {/* Additional features can be added here based on property type */}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="location">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <MapIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground ml-2">Map view available soon</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">Address</h4>
                      <p className="text-muted-foreground">
                        {[
                          property.address.street,
                          property.address.city,
                          property.address.state,
                          property.address.zip,
                          property.address.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Property Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Price Card */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-muted/40">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {formatCurrency(property.price)}
                </h2>
                <Badge>{property.transactionType}</Badge>
              </div>
              {property.transactionType.toLowerCase() === 'rent' && (
                <p className="text-sm text-muted-foreground">per month</p>
              )}
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between">
                <Button 
                  className="flex-1 mr-2" 
                  variant="outline"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <Button className="w-full">
                <External className="h-4 w-4 mr-2" />
                View Listing
              </Button>
              
              {/* Agent information */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Listed By</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-3">
                    {property.agent?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-medium">{property.agent?.name || 'Agent'}</p>
                    <p className="text-sm text-muted-foreground">Property Agent</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Information */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(property.price)}
                      {property.transactionType.toLowerCase() === 'rent' && ' /month'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Listed Date</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                
                {isDevelopment && property.stock && (
                  <div className="flex items-start">
                    <Package className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-muted-foreground">
                        {property.stock.available} of {property.stock.total} units available
                      </p>
                    </div>
                  </div>
                )}
                
                {property.type.toLowerCase() === 'residential' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{property.features?.bedrooms || 0} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{property.features?.bathrooms || 0} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Grid2X2 className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{property.features?.squareFeet || 0} sq.ft</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Information Cards can be added here */}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
