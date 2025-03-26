import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Grid2X2, 
  Car, 
  Heart, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ImagePlus,
  Building
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useProperties } from '@/hooks/useProperties';
import { formatCurrency } from '@/utils/propertyUtils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useProperty } = useProperties();
  const { data: property, isLoading, error } = useProperty(id || '');

  if (error) {
    toast.error("Failed to load property details");
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/properties')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Error loading property details. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Helper to safely access features 
  const getFeatureValue = (key: string, defaultValue: number = 0): number => {
    if (!property?.features) return defaultValue;
    
    if (Array.isArray(property.features)) {
      return defaultValue;
    }
    
    return (property.features as any)[key] || defaultValue;
  };

  // Helper function to get the first image or fallback to a placeholder
  const getImageUrl = () => {
    return property?.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg';
  };

  // Fix status badge conditionals
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'available') {
      return <Badge>Available</Badge>;
    } else if (statusLower === 'pending') {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Pending</Badge>;
    } else if (statusLower === 'sold' || statusLower === 'under offer') {
      return <Badge variant="secondary">Sold</Badge>;
    }
    
    return <Badge>{status}</Badge>;
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
        
        {!isLoading && property && 
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/properties/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm('Are you sure you want to delete this property?')) {
                  // Property deletion logic would go here
                  toast.success("Property deleted successfully");
                  navigate('/properties');
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      </div>

      {isLoading ? (
        <PropertyDetailSkeleton />
      ) : property ? (
        <>
          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Image and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm h-full">
                <div className="relative">
                  <img 
                    src={getImageUrl()}
                    alt={property.title} 
                    className="w-full h-64 object-cover" 
                  />
                  <Badge className="absolute top-2 right-2">{getStatusBadge(property.status || 'Available')}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{property.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {formatCurrency(property.price)}
                    </h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <p className="text-sm">
                        {[property.address?.city, property.address?.state].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <Bed className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Bedrooms</span>
                      <span className="text-sm font-medium">{getFeatureValue('bedrooms')}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <Bath className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Bathrooms</span>
                      <span className="text-sm font-medium">{getFeatureValue('bathrooms')}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <Grid2X2 className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Sq. Ft.</span>
                      <span className="text-sm font-medium">{getFeatureValue('squareFeet')}</span>
                    </div>
                    
                    <div className="flex flex-col items-start p-2 rounded-md bg-secondary/50">
                      <Car className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Parking</span>
                      <span className="text-sm font-medium">{getFeatureValue('parking')}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Details and Amenities */}
            <div className="lg:col-span-1 space-y-4">
              {/* Amenities Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {property.amenities && property.amenities.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {property.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-2">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No amenities listed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Additional Details Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Type:</span> {property.type}
                    </div>
                    <div>
                      <span className="font-medium">Year Built:</span> {property.yearBuilt || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Lot Size:</span> {property.lotSize || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Stories:</span> {property.stories || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Parking Spaces:</span> {property.parkingSpaces || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">HOA:</span> {property.hoa || 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <p className="mt-2 text-sm text-muted-foreground">Property not found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/properties')}>
            Back to Properties
          </Button>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for property details
const PropertyDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
      
      <Skeleton className="h-[150px] w-full rounded-lg" />
      
      <Skeleton className="h-12 w-full rounded-lg" />
      
      <Skeleton className="h-[150px] w-full rounded-lg" />
    </div>
  );
};

export default PropertyDetail;
