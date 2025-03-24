
import React, { useState } from 'react';
import { Plus, Bed, Bath, Square, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card as PropertyCard } from "@/components/ui/card";
import { Card } from "@/components/ui/component";
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/propertyUtils';
import { useNavigate } from 'react-router-dom';

type PropertyStatus = 'Active' | 'Under Contract' | 'Pending' | 'Sold' | 'New';

interface ShowcaseProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  daysOnMarket: number;
  status: PropertyStatus;
  image: string;
}

// Sample properties data for the showcase
const sampleProperties: ShowcaseProperty[] = [
  {
    id: '1',
    title: 'Modern Apartment with Ocean View',
    address: '123 Coastal Drive, Seaside',
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    daysOnMarket: 7,
    status: 'Active',
    image: '/lovable-uploads/a560c206-3e60-4f5e-913e-916d6e5c01e2.png'
  },
  {
    id: '2',
    title: 'Luxury Villa with Private Pool',
    address: '456 Hilltop Road, Highlands',
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4500,
    daysOnMarket: 14,
    status: 'Active',
    image: '/lovable-uploads/a560c206-3e60-4f5e-913e-916d6e5c01e2.png'
  },
  {
    id: '3',
    title: 'Downtown Penthouse Suite',
    address: '789 Central Avenue, Downtown',
    price: 1200000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2200,
    daysOnMarket: 21,
    status: 'Under Contract',
    image: '/lovable-uploads/a560c206-3e60-4f5e-913e-916d6e5c01e2.png'
  },
  {
    id: '4',
    title: 'Cozy Suburban Family Home',
    address: '101 Maple Street, Suburbia',
    price: 550000,
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 2800,
    daysOnMarket: 10,
    status: 'Active',
    image: '/lovable-uploads/a560c206-3e60-4f5e-913e-916d6e5c01e2.png'
  }
];

const PropertyShowcase = () => {
  const [activeTab, setActiveTab] = useState("my-listings");
  const navigate = useNavigate();

  const handleAddProperty = () => {
    navigate('/properties/new');
  };

  const handleViewProperty = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const getStatusBadgeStyle = (status: PropertyStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Under Contract':
        return 'bg-orange-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Sold':
        return 'bg-red-500 text-white';
      case 'New':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <Card variant="neubrutalism" className="bg-[#161920] dark:bg-[#161920] border-neutral-800">
      <Tabs defaultValue="my-listings" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header with navigation and filters in one row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold">Property Showcase</h2>
            
            <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-neutral-800/50">
              <TabsTrigger value="my-listings">My Listings</TabsTrigger>
              <TabsTrigger value="hot-properties">Hot Properties</TabsTrigger>
              <TabsTrigger value="new-projects">New Projects</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent border-neutral-700">
              All Types <Plus className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent border-neutral-700">
              All Prices <Plus className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent border-neutral-700">
              All Locations <Plus className="h-3.5 w-3.5 ml-1" />
            </Button>
            
            <Button onClick={handleAddProperty} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-1" /> Add Property
            </Button>
          </div>
        </div>
        
        {/* Property Cards */}
        <TabsContent value="my-listings" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sampleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-[#161920] border-neutral-800"
                onClick={() => handleViewProperty(property.id)}
              >
                {/* Property Image with Status Badge */}
                <div className="relative h-48">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2 font-medium",
                      getStatusBadgeStyle(property.status)
                    )}
                  >
                    {property.status}
                  </Badge>
                </div>
                
                {/* Property Info */}
                <div className="p-4 space-y-3">
                  {/* Title and Address */}
                  <div>
                    <h3 className="font-bold text-lg truncate">{property.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                  </div>
                  
                  {/* Price */}
                  <p className="text-xl font-bold">${formatPrice(property.price)}</p>
                  
                  {/* Specifications */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">{property.bathrooms} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span className="text-sm">{property.squareFeet} sqft</span>
                    </div>
                  </div>
                  
                  {/* Days on Market */}
                  <div className="flex justify-end items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{property.daysOnMarket} days on market</span>
                  </div>
                </div>
              </PropertyCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hot-properties" className="p-6">
          <div className="p-3 text-center text-muted-foreground">
            Hot properties will be displayed here
          </div>
        </TabsContent>
        
        <TabsContent value="new-projects" className="p-6">
          <div className="p-3 text-center text-muted-foreground">
            New projects will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PropertyShowcase;
