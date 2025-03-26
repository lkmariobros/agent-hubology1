
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useProperties } from '@/hooks/useProperties';
import { 
  Building, 
  MapPin, 
  User, 
  Calendar, 
  Edit, 
  Trash, 
  Share, 
  Heart, 
  ChevronLeft, 
  Loader2 
} from 'lucide-react';
import { mapPropertyData } from '@/utils/propertyUtils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  
  // Use the same hook but extract the first property
  const { data, isLoading, error } = useProperties(1, 1, { id });
  const propertyRaw = data?.properties?.[0]; 
  
  // Map to the expected format if we have data
  const property = propertyRaw ? mapPropertyData(propertyRaw) : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <Link to="/properties">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </Link>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">
              {error ? 'Error loading property. Please try again.' : 'Property not found.'}
            </p>
            <Link to="/properties">
              <Button>Return to Properties</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <Badge>Available</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Pending</Badge>;
      case 'sold':
        return <Badge variant="destructive">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/properties">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Building className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
              {getStatusBadge(property.status)}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{property.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zip}
                  </CardDescription>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <p className="text-muted-foreground">{property.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{property.type}</p>
                    </div>
                    {property.bedrooms !== undefined && (
                      <div className="text-center p-3 bg-muted/30 rounded-md">
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="text-center p-3 bg-muted/30 rounded-md">
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-medium">{property.bathrooms}</p>
                      </div>
                    )}
                    {property.area !== undefined && (
                      <div className="text-center p-3 bg-muted/30 rounded-md">
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-medium">{property.area} sq ft</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Listed By</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{property.agent?.name || "Unknown Agent"}</p>
                        <p className="text-sm text-muted-foreground">
                          Listed on {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features">
                  {property.features && property.features.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                          <span className="capitalize">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No features listed for this property.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="documents">
                  <p className="text-muted-foreground">No documents available for this property.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property ID</span>
                <span className="font-medium">{property.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{property.type}</span>
              </div>
              {property.subtype && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtype</span>
                  <span className="font-medium capitalize">{property.subtype}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span>{getStatusBadge(property.status)}</span>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Location</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Street:</span> {property.address.street}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">City:</span> {property.address.city}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">State:</span> {property.address.state}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Zip Code:</span> {property.address.zip}
                  </p>
                  {property.address.country && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Country:</span> {property.address.country}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Listing Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    <span>Listed by {property.agent?.name || "Unknown Agent"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Request Information</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
