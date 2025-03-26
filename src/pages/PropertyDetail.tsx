import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TeamNotes, TeamNote } from '@/components/property/TeamNotes';
import PropertyOwnerInfo from '@/components/property/PropertyOwnerInfo';
import PropertyGallery from '@/components/property/PropertyGallery';
import { CheckCircle2, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for team notes
const mockNotes: TeamNote[] = [{
  id: 1,
  author: {
    name: "John Smith",
    initials: "JS",
    avatarColor: "bg-blue-500"
  },
  date: "2 hours ago",
  content: "Just showed this property to the Johnsons. They're very interested and might make an offer soon."
}, {
  id: 2,
  author: {
    name: "Sarah Lee",
    initials: "SL",
    avatarColor: "bg-green-500"
  },
  date: "Yesterday",
  content: "Owner mentioned they might be willing to negotiate on the price. Starting point is firm though."
}];
const PropertyDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    isAdmin
  } = useAuth();
  const navigate = useNavigate();

  // Mocked data for development
  const useMockData = process.env.NODE_ENV === 'development' && (id === '1' || id === '2' || id === '3');
  const {
    data: propertyResponse,
    isLoading,
    error
  } = useProperty(id || '', {
    enabled: !useMockData // Only enable the query if we're not using mock data
  });
  const [notes, setNotes] = useState<TeamNote[]>(mockNotes);
  const [property, setProperty] = useState<any>(null);
  useEffect(() => {
    // In a real app, you would fetch notes from Supabase here
    console.log('Property detail loaded for ID:', id);

    // If using mock data for development (when UUID validation fails)
    if (useMockData) {
      console.log('Using mock data for property ID:', id);
      // Load mock data based on the ID
      const mockProperty = {
        id: id,
        title: `Sample Property ${id}`,
        description: 'This is a sample property description used for development.',
        price: 750000,
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zip: '94102',
        bedrooms: 3,
        bathrooms: 2,
        built_up_area: 1500,
        land_area: 2000,
        featured: true,
        agent_notes: 'Owner is highly motivated to sell.',
        created_at: new Date().toISOString(),
        property_types: {
          name: 'Residential'
        },
        transaction_types: {
          name: 'For Sale'
        },
        property_statuses: {
          name: 'Active'
        },
        property_images: [{
          id: 1,
          storage_path: 'https://picsum.photos/id/1067/800/600',
          is_cover: true
        }, {
          id: 2,
          storage_path: 'https://picsum.photos/id/1068/800/600'
        }, {
          id: 3,
          storage_path: 'https://picsum.photos/id/1069/800/600'
        }, {
          id: 4,
          storage_path: 'https://picsum.photos/id/1070/800/600'
        }, {
          id: 5,
          storage_path: 'https://picsum.photos/id/1071/800/600'
        }]
      };
      setProperty(mockProperty);
    } else if (propertyResponse?.data) {
      setProperty(propertyResponse.data);
    }
  }, [id, propertyResponse, useMockData]);
  const handleAddNote = (note: Omit<TeamNote, 'id' | 'date'>) => {
    // In a real app, you would add the note to Supabase here
    const newNote: TeamNote = {
      id: notes.length + 1,
      author: note.author,
      content: note.content,
      date: 'Just now'
    };
    setNotes([newNote, ...notes]);
    toast.success('Note added successfully');
  };
  const handleEditProperty = () => {
    navigate(`/properties/edit/${id}`);
  };
  const handleDeleteProperty = () => {
    // Implement delete functionality
    toast.error('Delete functionality not implemented yet');
  };
  if (isLoading && !useMockData) {
    return <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
          <p>Loading property details...</p>
        </div>
      </div>;
  }
  if ((error || !propertyResponse?.data) && !useMockData) {
    console.error('Error loading property:', error?.message || 'Property not found', propertyResponse);
    return <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Property</h2>
        <p className="text-muted-foreground mb-6">{error?.message || 'Property not found'}</p>
        <Button onClick={() => navigate('/properties')}>
          Return to Properties
        </Button>
      </div>;
  }
  if (!property) {
    return <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested property could not be found.</p>
        <Button onClick={() => navigate('/properties')}>
          Return to Properties
        </Button>
      </div>;
  }
  console.log('Property data:', property);

  // Extract property type from property_types relation
  const propertyType = property.property_types?.name || 'Property';

  // Create an array of image URLs from property_images
  const propertyImages = property.property_images ? property.property_images.map((img: any) => img.storage_path).filter(Boolean) : [];

  // Mock owner data - in a real app this would come from the API
  const owner = {
    name: "Michael Roberts",
    email: "michael.roberts@example.com",
    phone: "+1 (555) 123-4567",
    company: "Roberts Real Estate Holdings"
  };
  return <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1" onClick={handleEditProperty}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {isAdmin && <Button variant="destructive" className="flex items-center gap-1" onClick={handleDeleteProperty}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>}
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyGallery images={propertyImages} title={property.title} />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{propertyType}</Badge>
                <Badge variant="outline">
                  {property.transaction_types?.name || 'For Sale'}
                </Badge>
                {property.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              
              <p className="text-3xl font-bold mb-6">${property.price?.toLocaleString()}</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span>{property.id}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Address:</span>
                  <span>{property.street}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">City:</span>
                  <span>{property.city}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">State:</span>
                  <span>{property.state}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{property.land_area || property.floor_area || property.built_up_area} sqft</span>
                </div>
                {property.bedrooms && <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span>{property.bedrooms}</span>
                  </div>}
                {property.bathrooms && <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span>{property.bathrooms}</span>
                  </div>}
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">
                    {property.property_statuses?.name || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Split layout with tabs on the left and team notes on the right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tabs section - takes 2/3 of the space */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["Central Air Conditioning", "In-unit Laundry", "Hardwood Floors", "Stainless Steel Appliances", "Granite Countertops", "Walk-in Closets"].map((feature, idx) => <li key={idx} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Building Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["24-hour Concierge", "Fitness Center", "Rooftop Terrace", "Package Room", "Bicycle Storage", "Pet Friendly"].map((amenity, idx) => <li key={idx} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          {amenity}
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {property.description || 'No description available for this property.'}
                  </p>
                  
                  {property.agent_notes && <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-semibold mb-2">Agent Notes</h3>
                        <p className="text-muted-foreground">
                          {property.agent_notes}
                        </p>
                      </div>
                    </>}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="owner">
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto md:mx-0">
                    <PropertyOwnerInfo owner={owner} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-4">
                    No transaction history available for this property
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Property Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-4">
                    No documents available for this property
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Property created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(property.created_at).toLocaleDateString()} by {property.agent_id || 'System'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Team Notes section - takes 1/3 of the space */}
        <div className="md:col-span-1 h-full">
          <Card className="h-full">
            <CardHeader>
              
            </CardHeader>
            <CardContent>
              <TeamNotes notes={notes} onAddNote={handleAddNote} className="h-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default PropertyDetail;