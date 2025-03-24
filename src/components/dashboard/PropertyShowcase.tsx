
import React, { useState } from 'react';
import { Plus, Bed, Bath, Square, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    image: '/lovable-uploads/d15461f5-44c4-4e02-b57c-9ba4d4654b4f.png'
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
    image: '/lovable-uploads/d15461f5-44c4-4e02-b57c-9ba4d4654b4f.png'
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
    image: '/lovable-uploads/d15461f5-44c4-4e02-b57c-9ba4d4654b4f.png'
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
    image: '/lovable-uploads/d15461f5-44c4-4e02-b57c-9ba4d4654b4f.png'
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

  // Debugging - Log to ensure component is being rendered
  console.log("Rendering PropertyShowcase with Card from component.tsx");

  return (
    <Card 
      variant="neubrutalism" 
      className="bg-[#161920] dark:bg-[#161920] border-neutral-800 rounded-xl overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          {/* Left side: Title and Tabs */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-white">Property Showcase</h2>
            
            <Tabs defaultValue="my-listings" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent p-0 h-auto space-x-2">
                <TabsTrigger 
                  value="my-listings" 
                  className={cn(
                    "rounded-md px-5 py-2 text-white", 
                    activeTab === "my-listings" 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-[#1E2128] hover:bg-[#282c36]"
                  )}
                >
                  My Listings
                </TabsTrigger>
                <TabsTrigger 
                  value="hot-properties"
                  className={cn(
                    "rounded-md px-5 py-2 text-white", 
                    activeTab === "hot-properties" 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-[#1E2128] hover:bg-[#282c36]"
                  )}
                >
                  Hot Properties
                </TabsTrigger>
                <TabsTrigger 
                  value="new-projects"
                  className={cn(
                    "rounded-md px-5 py-2 text-white", 
                    activeTab === "new-projects" 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-[#1E2128] hover:bg-[#282c36]"
                  )}
                >
                  New Projects
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Right side: Filters and Add Button */}
          <div className="flex flex-col space-y-4 mt-6 lg:mt-0 w-full lg:w-auto">
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              <Button variant="outline" size="sm" className="bg-[#232731] hover:bg-[#2c313c] border-none text-white rounded-md py-2 px-4 h-auto flex items-center">
                All Types <Plus className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="bg-[#232731] hover:bg-[#2c313c] border-none text-white rounded-md py-2 px-4 h-auto flex items-center">
                All Prices <Plus className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="bg-[#232731] hover:bg-[#2c313c] border-none text-white rounded-md py-2 px-4 h-auto flex items-center">
                All Locations <Plus className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
            
            <Button 
              onClick={handleAddProperty} 
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 w-full lg:w-auto self-end"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Property
            </Button>
          </div>
        </div>
        
        {/* Property Cards - Updated to match image design */}
        <Tabs defaultValue="my-listings" value={activeTab} className="w-full">
          <TabsContent value="my-listings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-[#1E2128] border border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
                        "absolute top-3 right-3 font-medium rounded-md px-3 py-1",
                        getStatusBadgeStyle(property.status)
                      )}
                    >
                      {property.status}
                    </Badge>
                  </div>
                  
                  {/* Property Info */}
                  <div className="p-5 space-y-4">
                    {/* Title and Address */}
                    <div>
                      <h3 className="font-bold text-lg text-white truncate">{property.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{property.address}</p>
                    </div>
                    
                    {/* Price */}
                    <p className="text-xl font-bold text-white">${formatPrice(property.price)}</p>
                    
                    {/* Specifications */}
                    <div className="flex justify-between items-center text-gray-300">
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
                    <div className="flex justify-end items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{property.daysOnMarket} days on market</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hot-properties" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              Hot properties will be displayed here
            </div>
          </TabsContent>
          
          <TabsContent value="new-projects" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              New projects will be displayed here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default PropertyShowcase;
