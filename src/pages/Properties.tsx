
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ChevronRight, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Sample properties data
const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Luxurious apartment in downtown with excellent amenities.',
    price: 425000,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    type: 'residential',
    subtype: 'apartment',
    features: ['balcony', 'parking', 'pool'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['https://picsum.photos/id/1068/800/600'],
    status: 'available',
    listedBy: 'agent123',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    description: 'Spacious family home with large backyard in quiet neighborhood.',
    price: 750000,
    address: {
      street: '456 Oak Ave',
      city: 'Palo Alto',
      state: 'CA',
      zip: '94301',
      country: 'USA'
    },
    type: 'residential',
    subtype: 'house',
    features: ['backyard', 'garage', 'renovated kitchen'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: ['https://picsum.photos/id/164/800/600'],
    status: 'pending',
    listedBy: 'agent456',
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-02-05T14:15:00Z'
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    description: 'Prime location commercial office in the business district.',
    price: 1200000,
    address: {
      street: '789 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'USA'
    },
    type: 'commercial',
    subtype: 'office',
    features: ['reception', 'conference rooms', 'parking'],
    area: 3500,
    images: ['https://picsum.photos/id/260/800/600'],
    status: 'available',
    listedBy: 'agent789',
    createdAt: '2024-01-20T11:45:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  }
];

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0 overflow-hidden">
        <div className="relative h-48">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded-full text-xs font-medium">
            {property.status === 'available' ? 'Available' : 'Pending'}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{property.title}</h3>
          <p className="text-muted-foreground text-sm">{property.address.city}, {property.address.state}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-lg">${property.price.toLocaleString()}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {property.type === 'residential' && (
                <>
                  <span>{property.bedrooms} bd</span>
                  <span>•</span>
                  <span>{property.bathrooms} ba</span>
                  <span>•</span>
                </>
              )}
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Properties = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <Button className="gap-2">
            <Plus size={16} />
            Add Property
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Search Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search by address, title..." className="w-full" icon={<Search className="w-4 h-4" />} />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
