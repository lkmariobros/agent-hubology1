
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for team notes
const mockNotes: TeamNote[] = [
  {
    id: 1,
    author: {
      name: "John Smith",
      initials: "JS",
      avatarColor: "bg-blue-500"
    },
    date: "2 hours ago",
    content: "Just showed this property to the Johnsons. They're very interested and might make an offer soon."
  },
  {
    id: 2,
    author: {
      name: "Sarah Lee",
      initials: "SL",
      avatarColor: "bg-green-500"
    },
    date: "Yesterday",
    content: "Owner mentioned they might be willing to negotiate on the price. Starting point is firm though."
  }
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { data: propertyResponse, isLoading, error } = useProperty(id || '');
  const [notes, setNotes] = useState<TeamNote[]>(mockNotes);
  
  useEffect(() => {
    // In a real app, you would fetch notes from Supabase here
    // Example:
    // const fetchNotes = async () => {
    //   const { data, error } = await supabase
    //     .from('property_notes')
    //     .select('*')
    //     .eq('property_id', id);
    //   
    //   if (data) {
    //     setNotes(data);
    //   }
    // };
    // 
    // fetchNotes();
  }, [id]);
  
  const handleAddNote = (note: Omit<TeamNote, 'id' | 'date'>) => {
    // In a real app, you would add the note to Supabase here
    // Example:
    // const addNote = async () => {
    //   const { data, error } = await supabase
    //     .from('property_notes')
    //     .insert({
    //       property_id: id,
    //       author_id: auth.user.id,
    //       content: note.content
    //     });
    // };
    
    const newNote: TeamNote = {
      id: notes.length + 1,
      author: note.author,
      content: note.content,
      date: 'Just now'
    };
    
    setNotes([newNote, ...notes]);
    toast.success('Note added successfully');
  };
  
  if (isLoading) {
    return <div className="p-6">Loading property details...</div>;
  }
  
  if (error || !propertyResponse?.data) {
    return <div className="p-6">Error loading property: {error?.message || 'Property not found'}</div>;
  }
  
  const property = propertyResponse.data;
  
  // Mock owner data - in a real app this would come from the API
  const owner = {
    name: "Michael Roberts",
    email: "michael.roberts@example.com",
    phone: "+1 (555) 123-4567",
    company: "Roberts Real Estate Holdings"
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {isAdmin && (
            <Button variant="destructive" className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyGallery 
              images={property.images || []} 
              title={property.title} 
            />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{property.type}</Badge>
                <Badge variant="outline">
                  {property.transaction_types?.name || 'For Sale'}
                </Badge>
                {property.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
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
                {property.bedrooms && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span>{property.bathrooms}</span>
                  </div>
                )}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
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
                      {["Central Air Conditioning", "In-unit Laundry", "Hardwood Floors", 
                        "Stainless Steel Appliances", "Granite Countertops", "Walk-in Closets"].map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Building Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["24-hour Concierge", "Fitness Center", "Rooftop Terrace", 
                        "Package Room", "Bicycle Storage", "Pet Friendly"].map((amenity, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          {amenity}
                        </li>
                      ))}
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
                  
                  {property.agent_notes && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-semibold mb-2">Agent Notes</h3>
                        <p className="text-muted-foreground">
                          {property.agent_notes}
                        </p>
                      </div>
                    </>
                  )}
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
        
        <div className="space-y-6">
          <PropertyOwnerInfo owner={owner} />
          <TeamNotes notes={notes} onAddNote={handleAddNote} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
