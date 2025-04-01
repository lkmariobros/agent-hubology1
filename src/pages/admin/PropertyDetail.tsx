
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useProperty } from '@/hooks/useProperty';
import { useTransactions } from '@/hooks/useTransactions';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertyMap from '@/components/properties/PropertyMap';
import PropertyDocuments from '@/components/properties/PropertyDocuments';
import PropertyTransactions from '@/components/properties/PropertyTransactions';
import PropertyNotes from '@/components/properties/PropertyNotes';
import PropertyEditForm from '@/components/properties/PropertyEditForm';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { AlertCircle, ArrowLeft, Building, Calendar, DollarSign, Edit, MapPin, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: property, isLoading, error } = useProperty(id);
  
  // Fix the useTransactions call
  const transactionsHooks = useTransactions();
  const { data: transactionsData } = transactionsHooks.useTransactionsQuery({ 
    propertyId: id 
  });
  const transactions = transactionsData?.transactions || [];
  
  useEffect(() => {
    // Set page title
    if (property) {
      document.title = `${property.address} | Admin Portal`;
    }
    
    return () => {
      document.title = 'Admin Portal';
    };
  }, [property]);
  
  if (isLoading) {
    return <LoadingIndicator text="Loading property details..." />;
  }
  
  if (error || !property) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error Loading Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-300">
            {error?.message || "The requested property could not be found."}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/admin/properties')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleEditComplete = () => {
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2"
              onClick={() => navigate('/admin/properties')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Button>
            
            <Badge variant={property?.status === 'active' ? 'default' : 'secondary'}>
              {property?.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            
            <Badge variant="outline">
              {property?.type === 'residential' ? 'Residential' : 'Commercial'}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight">{property?.address}</h1>
          <p className="text-muted-foreground">
            {property?.city}, {property?.state} {property?.zip}
          </p>
        </div>
        
        {isAdmin && !isEditing && property && (
          <Button onClick={handleEditToggle}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Property</CardTitle>
            <CardDescription>Update property information</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyEditForm 
              property={property} 
              onComplete={handleEditComplete} 
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Basic Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Property ID</dt>
                        <dd className="font-medium">{property.id.substring(0, 8)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium capitalize">{property.type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Status</dt>
                        <dd className="font-medium capitalize">{property.status}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Listed Date</dt>
                        <dd className="font-medium">{formatDate(property.created_at)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Last Updated</dt>
                        <dd className="font-medium">{formatDate(property.updated_at)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Property Specifications</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Bedrooms</dt>
                        <dd className="font-medium">{property.bedrooms || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Bathrooms</dt>
                        <dd className="font-medium">{property.bathrooms || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Square Footage</dt>
                        <dd className="font-medium">{property.square_footage ? `${property.square_footage} sq ft` : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Lot Size</dt>
                        <dd className="font-medium">{property.lot_size ? `${property.lot_size} acres` : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Year Built</dt>
                        <dd className="font-medium">{property.year_built || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Financial Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Listing Price</dt>
                        <dd className="font-medium">{formatCurrency(property.price)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Price per sq ft</dt>
                        <dd className="font-medium">
                          {property.square_footage 
                            ? formatCurrency(property.price / property.square_footage) 
                            : 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Property Taxes</dt>
                        <dd className="font-medium">
                          {property.annual_taxes 
                            ? `${formatCurrency(property.annual_taxes)}/year` 
                            : 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">HOA Fees</dt>
                        <dd className="font-medium">
                          {property.hoa_fees 
                            ? `${formatCurrency(property.hoa_fees)}/month` 
                            : 'None'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Contact Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Owner</dt>
                        <dd className="font-medium">{property.owner_name || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Owner Email</dt>
                        <dd className="font-medium">{property.owner_email || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Owner Phone</dt>
                        <dd className="font-medium">{property.owner_phone || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Listing Agent</dt>
                        <dd className="font-medium">{property.agent_name || 'Unassigned'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Property Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium capitalize">{property.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listing Price</p>
                    <p className="font-medium">{formatCurrency(property.price)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{property.city}, {property.state}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listed On</p>
                    <p className="font-medium">{formatDate(property.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listing Agent</p>
                    <p className="font-medium">{property.agent_name || 'Unassigned'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-6">
              <PropertyGallery propertyId={property.id} />
            </TabsContent>
            
            <TabsContent value="map" className="mt-6">
              <PropertyMap 
                address={property.address} 
                city={property.city} 
                state={property.state} 
                zip={property.zip} 
              />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <PropertyDocuments propertyId={property.id} />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-6">
              <PropertyTransactions 
                transactions={transactions || []} 
                propertyId={property.id} 
              />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6">
              <PropertyNotes propertyId={property.id} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PropertyDetail;
