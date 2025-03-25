
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
  MessageSquare
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: propertyData, isLoading, error } = useProperty(id || '');
  const [activeImage, setActiveImage] = useState(0);

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

  // Mock contact information (would be fetched from API in real implementation)
  const contact = {
    name: "Ahmad Razali",
    role: "Owner",
    avatar: null,
    initials: "AR",
    phone: "+60123456789",
    email: "ahmad@example.com"
  };

  // Mock team notes data
  const teamNotes = [
    {
      id: 1,
      author: {
        name: "John Doe",
        initials: "JD",
        avatarColor: "bg-blue-500"
      },
      date: "Jun 15, 2023",
      content: "Client is very interested in this property but concerned about the price. Might be open to offers 5% below asking."
    },
    {
      id: 2,
      author: {
        name: "Lisa Park",
        initials: "LP",
        avatarColor: "bg-green-500"
      },
      date: "May 28, 2023",
      content: "Owner mentioned they can expedite the closing process if needed. Also willing to leave some furniture if buyer is interested."
    }
  ];

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
          {/* Property detail - two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left column - Image gallery (60-65% width) */}
            <div className="lg:col-span-3">
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
            
            {/* Right column - Property details (35-40% width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property info card */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm">
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
                  
                  {/* Contact information */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">PRIMARY CONTACT</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
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
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Notes section - directly visible instead of in a tab */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Team Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {teamNotes.map((note) => (
                      <div key={note.id} className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className={note.author.avatarColor + " text-white"}>
                              {note.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{note.author.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{note.date}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                    
                    {/* Add note button */}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <User className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Tabs section - with Team Notes removed since it's shown above */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="w-full border-b rounded-none bg-transparent h-12 p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
              >
                Overview
              </TabsTrigger>
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
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Description section */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  {property.description ? (
                    <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No description available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Map section replaced with "Coming Soon" notice */}
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                  </div>
                  <div className="h-[200px] bg-muted rounded-lg overflow-hidden">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30">
                      <MapPin className="h-12 w-12 text-primary opacity-30 mb-4" />
                      <p className="text-muted-foreground">Map integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
                <CardContent className="p-6">
                  {property.features && property.features.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Tag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <p className="mt-2 text-sm text-muted-foreground">No features listed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <Card className="overflow-hidden border-neutral-800 bg-card/90">
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full rounded-lg" />
      
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
};

export default PropertyDetail;
