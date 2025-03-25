import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProperty } from '@/hooks/useProperties';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Home,
  Square, 
  Bed, 
  Bath,
  FileText, 
  Phone, 
  Mail,
  User,
  Building2, 
  Tag, 
  MessageSquare,
  Plus,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamNotes, TeamNote } from '@/components/property/TeamNotes';

// Mock contact information (would be fetched from API in real implementation)
const mockContacts = [
  {
    id: 1,
    name: "Ahmad Razali",
    role: "Owner",
    avatar: null,
    initials: "AR",
    phone: "+60123456789",
    email: "ahmad@example.com"
  },
  {
    id: 2,
    name: "Sarah Lee",
    role: "Co-Owner",
    avatar: null,
    initials: "SL",
    phone: "+60123456790",
    email: "sarah@example.com"
  }
];

// Mock team notes data
const teamNotes: TeamNote[] = [
  {
    id: 1,
    author: {
      name: "John Doe",
      initials: "JD",
      avatarColor: "bg-blue-500"
    },
    date: "Jun 15, 2023",
    content: "Client is very interested in this property but concerned about the price. Might be open to offers 5% below asking.",
    action: "opened a new issue"
  },
  {
    id: 2,
    author: {
      name: "Lisa Park",
      initials: "LP",
      avatarColor: "bg-green-500"
    },
    date: "May 28, 2023",
    content: "Owner mentioned they can expedite the closing process if needed. Also willing to leave some furniture if buyer is interested.",
    action: "commented on"
  },
  {
    id: 3,
    author: {
      name: "Michael Chen",
      initials: "MC",
      avatarColor: "bg-purple-500"
    },
    date: "May 15, 2023",
    content: "Had a viewing with a potential buyer who likes the location but needs more information about the building maintenance history.",
    action: "assigned you to"
  },
  {
    id: 4,
    author: {
      name: "Emma Wilson",
      initials: "EW",
      avatarColor: "bg-amber-500"
    },
    date: "May 10, 2023",
    content: "Spoke with building management. They confirmed that the roof was replaced last year and all plumbing was updated. This could be a good selling point.",
    action: "closed the issue"
  }
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: propertyData, isLoading, error } = useProperty(id || '');
  const [activeImage, setActiveImage] = useState(0);
  const [contacts, setContacts] = useState(mockContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [notes, setNotes] = useState(teamNotes);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phone: '',
    email: ''
  });

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

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
  };

  const handleAddContact = () => {
    // Basic validation
    if (!newContact.name) {
      toast.error("Contact name is required");
      return;
    }

    const initials = newContact.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const contact = {
      id: contacts.length + 1,
      name: newContact.name,
      role: newContact.role || "Contact",
      avatar: null,
      initials,
      phone: newContact.phone,
      email: newContact.email
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', role: '', phone: '', email: '' });
    setShowAddContact(false);
    toast.success("Contact added successfully");
  };

  const handleRemoveContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success("Contact removed");
  };

  const handleAddNote = (note: Omit<TeamNote, 'id' | 'date'>) => {
    const newNote: TeamNote = {
      ...note,
      id: notes.length + 1,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      })
    };
    
    setNotes([newNote, ...notes]);
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
          {/* First Row: Property Images and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column - Image gallery (3 column spans) */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Main image with status badges */}
                <div className="relative rounded-lg overflow-hidden h-[400px] bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[activeImage]} 
                      alt={property.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Building2 className="h-24 w-24 text-muted-foreground opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className={property.status === 'available' ? 'bg-green-500 hover:bg-green-600' : property.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                      {property.type}
                    </Badge>
                  </div>
                </div>
                
                {/* Thumbnail strip */}
                {property.images && property.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(0, 3).map((image, index) => (
                      <div 
                        key={index}
                        className={`h-24 relative rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {property.images.length > 3 && (
                      <div className="h-24 bg-muted rounded-md flex items-center justify-center cursor-pointer">
                        <span className="text-lg font-semibold">+{property.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Property details (1 column span) */}
            <div className="lg:col-span-1">
              {/* Property info card */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm h-full">
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
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Updated {new Date(property.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Property specifications grid */}
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
                      <Square className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Size</span>
                      <span className="text-sm font-medium">{property.size} sqft</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
                      <Bed className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Beds</span>
                      <span className="text-sm font-medium">{property.bedrooms || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
                      <Bath className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Baths</span>
                      <span className="text-sm font-medium">{property.bathrooms || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
                      <Home className="h-5 w-5 mb-1" />
                      <span className="text-xs text-muted-foreground">Type</span>
                      <span className="text-sm font-medium">{property.subtype || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Multiple Contacts information */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">CONTACTS</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddContact(!showAddContact)} className="h-7 px-2 text-xs">
                        {showAddContact ? <ChevronUp className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                        {showAddContact ? 'Cancel' : 'Add Contact'}
                      </Button>
                    </div>
                    
                    {/* Add contact form */}
                    {showAddContact && (
                      <div className="bg-muted/50 p-3 rounded-md mb-3 space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Name*</label>
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 text-sm bg-background rounded border border-input mt-1" 
                              value={newContact.name}
                              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                              placeholder="Contact name"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Role</label>
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 text-sm bg-background rounded border border-input mt-1" 
                              value={newContact.role}
                              onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                              placeholder="e.g. Owner, Agent"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Phone</label>
                            <input 
                              type="tel" 
                              className="w-full px-2 py-1 text-sm bg-background rounded border border-input mt-1" 
                              value={newContact.phone}
                              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                              placeholder="Phone number"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Email</label>
                            <input 
                              type="email" 
                              className="w-full px-2 py-1 text-sm bg-background rounded border border-input mt-1" 
                              value={newContact.email}
                              onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={handleAddContact} className="h-7 px-3 text-xs">Add Contact</Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Contact list */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              {contact.avatar ? (
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                              ) : (
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {contact.initials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Call">
                              <Phone className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Email">
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive/90" 
                              title="Remove contact"
                              onClick={() => handleRemoveContact(contact.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {contacts.length === 0 && (
                        <div className="text-center py-3 text-sm text-muted-foreground">
                          No contacts added yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Second Row: Team Notes and Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Team Notes Section - (2 column spans) */}
            <div className="lg:col-span-2">
              <TeamNotes 
                notes={notes} 
                onAddNote={handleAddNote}
              />
            </div>
            
            {/* Right column for Overview and Map - (1 column span) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Overview Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {property.description ? (
                    <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                  ) : (
                    <div className="text-center py-2">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No description available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Map Section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-muted rounded-lg overflow-hidden h-[200px]">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30">
                      <MapPin className="h-12 w-12 text-primary opacity-30 mb-4" />
                      <p className="text-muted-foreground">Map integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Fourth row layout with tabs section */}
          <div className="mt-4">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="w-full border-b rounded-none bg-transparent h-12 p-0">
                <TabsTrigger 
                  value="features" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                >
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="mt-4">
                <Card className="overflow-hidden border-neutral-800 bg-card/90">
                  <CardContent className="p-4">
                    {property.features && property.features.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                          {property.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Tag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                        <p className="mt-2 text-sm text-muted-foreground">No features listed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <Card className="overflow-hidden border-neutral-800 bg-card/90">
                  <CardContent className="p-4">
                    <div className="text-center py-4">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No documents available</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <Card className="overflow-hidden border-neutral-800 bg-card/90">
                  <CardContent className="p-4">
                    <div className="text-center py-4">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No history available</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
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
