
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProperty } from '@/hooks/useProperties';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Building2, Edit, Trash2, MapPin, Calendar, DollarSign, Tag, Info, Home, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: propertyData, isLoading, error } = useProperty(id || '');

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

  const property = propertyData?.data;

  return (
    <div className="space-y-6">
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
          {/* Property hero section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px] bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Building2 className="h-24 w-24 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Badge className={property.status === 'available' ? 'bg-green-500 hover:bg-green-600' : property.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                    {property.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">
                      {property.address.street}, {property.address.city}, {property.address.state}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-primary" />
                      <span className="text-xl font-bold">${property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Updated {new Date(property.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {property.size && (
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                          <Info className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Size</p>
                          <p className="text-sm font-medium">{property.size} sqft</p>
                        </div>
                      </div>
                    )}
                    
                    {property.bedrooms && (
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                          <Home className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bedrooms</p>
                          <p className="text-sm font-medium">{property.bedrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    {property.bathrooms && (
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                            <line x1="10" y1="16" x2="14" y2="16"></line>
                            <path d="M15 6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6.5"></path>
                            <path d="M17 14c-2 2-4.5 2.5-6.5 1.5S8 12 10 10s4.5-2.5 6.5-1.5c2 1 2.5 3.5.5 5.5z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bathrooms</p>
                          <p className="text-sm font-medium">{property.bathrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Subtype</p>
                        <p className="text-sm font-medium">{property.subtype || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Property details tabs */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  {property.description ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No description available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  {property.features && property.features.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No features listed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <p className="mt-2 text-sm text-muted-foreground">No documents available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[300px] md:h-[400px] w-full rounded-lg" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/2 mt-4" />
          
          <div className="grid grid-cols-2 gap-2 mt-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Skeleton className="h-10 w-64 rounded-lg mb-6" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default PropertyDetail;
