
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyTable } from '@/components/property/PropertyTable';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Property } from '@/types';

// Sample properties data that matches the Property type
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment',
    description: 'Spacious modern apartment in downtown area',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94101',
      country: 'USA'
    },
    price: 850000,
    status: 'available',
    type: 'residential',
    subtype: 'apartment',
    features: ['Central AC', 'Hardwood Floors', 'Balcony'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['https://placehold.co/600x400'],
    listedBy: 'John Doe',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: '2',
    title: 'Downtown Office Space',
    description: 'Prime commercial office space in business district',
    address: {
      street: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    price: 1250000,
    status: 'available',
    type: 'commercial',
    subtype: 'office',
    features: ['24/7 Security', 'Parking', 'Conference Rooms'],
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    images: ['https://placehold.co/600x400'],
    listedBy: 'Jane Smith',
    createdAt: '2023-01-15',
    updatedAt: '2023-01-15'
  }
];

const AdminProperties = () => {
  const [properties] = useState(sampleProperties);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Link to="/properties/new">
          <Button className="mt-3 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <SortDesc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select className="text-sm border rounded px-2 py-1">
              <option>All Properties</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Land</option>
            </select>
          </div>
        </div>
        
        <TabsContent value="grid">
          <PropertyGrid properties={properties} />
        </TabsContent>
        
        <TabsContent value="table">
          <PropertyTable properties={properties} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProperties;
