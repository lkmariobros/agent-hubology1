
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { sampleProperties } from '@/data/sampleProperties';

const PropertyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const properties: Property[] = [
    {
      id: 'prop-1',
      title: 'Modern Downtown Loft',
      description: 'Spacious loft with modern finishes and city views.',
      price: 750000,
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      },
      type: 'residential',
      subtype: 'condo',
      features: ['Doorman', 'Gym', 'Rooftop Deck'],
      bedrooms: 2,
      bathrooms: 2,
      builtUpArea: 1200,
      status: 'available',
      area: '1200',
      listedBy: 'agency',
      images: ['/images/loft1.jpg', '/images/loft2.jpg'],
      createdAt: '2023-01-15',
      updatedAt: '2023-02-01'
    },
    {
      id: 'prop-2',
      title: 'Suburban Family Home',
      description: 'Beautiful family home in a quiet neighborhood.',
      price: 950000,
      address: {
        street: '456 Oak Ave',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301',
        country: 'USA'
      },
      type: 'residential',
      subtype: 'single-family',
      features: ['Backyard', 'Garage', 'Fireplace'],
      bedrooms: 4,
      bathrooms: 3,
      builtUpArea: 2500,
      status: 'available',
      area: '2500',
      listedBy: 'agency',
      images: ['/images/house1.jpg', '/images/house2.jpg'],
      createdAt: '2023-01-20',
      updatedAt: '2023-02-05'
    },
    {
      id: 'prop-3',
      title: 'Luxury Waterfront Villa',
      description: 'Stunning waterfront property with panoramic views.',
      price: 3500000,
      address: {
        street: '789 Ocean Blvd',
        city: 'Santa Monica',
        state: 'CA',
        zip: '90402',
        country: 'USA'
      },
      type: 'residential',
      subtype: 'villa',
      features: ['Pool', 'Private Beach', 'Home Theater'],
      bedrooms: 6,
      bathrooms: 7,
      builtUpArea: 6000,
      status: 'available',
      area: '6000',
      listedBy: 'agency',
      images: ['/images/villa1.jpg', '/images/villa2.jpg'],
      createdAt: '2023-01-25',
      updatedAt: '2023-02-10'
    }
  ].concat(sampleProperties);

  // Filter properties based on search term and type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Listings</h1>
        <Button>
          Add New Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="search">Search Properties</Label>
          <Input 
            id="search" 
            placeholder="Search by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="type">Property Type</Label>
          <select 
            id="type" 
            className="w-full p-2 border rounded" 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="land">Land</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <Card key={property.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={property.images[0] || '/placeholder-property.jpg'} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{property.title}</CardTitle>
                <Badge variant="outline">{property.status}</Badge>
              </div>
              <div className="text-lg font-bold">${property.price.toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-3 text-sm">
                  <div>{property.bedrooms} Beds</div>
                  <div>{property.bathrooms} Baths</div>
                  <div>{property.builtUpArea} sqft</div>
                </div>
                <Badge variant="secondary">{property.type}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground truncate">
                  {property.address.city}, {property.address.state}
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
