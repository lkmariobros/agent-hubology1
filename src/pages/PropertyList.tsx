
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Grid3X3, List, Filter } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice } from '@/utils/propertyUtils';

export const PropertyList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  // Placeholder properties data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      description: 'Luxurious apartment in downtown with excellent amenities.',
      price: 425000,
      type: 'residential',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      images: ['https://picsum.photos/id/1068/800/600'],
      status: 'available',
    },
    {
      id: '2',
      title: 'Suburban Family Home',
      description: 'Spacious family home with large backyard in quiet neighborhood.',
      price: 750000,
      type: 'residential',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      images: ['https://picsum.photos/id/164/800/600'],
      status: 'pending',
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      description: 'Prime location commercial office in the business district.',
      price: 1200000,
      type: 'commercial',
      area: 3500,
      images: ['https://picsum.photos/id/260/800/600'],
      status: 'available',
    }
  ];

  const handleNewProperty = () => {
    navigate('/properties/new');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Browse and manage properties</p>
        </div>
        <Button onClick={handleNewProperty} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Property
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={property.images?.[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {property.status === 'available' ? 'Available' : property.status === 'pending' ? 'Pending' : property.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{property.title}</h3>
                    <p className="text-lg font-semibold">{formatPrice(property.price)}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      {property.bedrooms && (
                        <span className="mr-3">{property.bedrooms} Beds</span>
                      )}
                      {property.bathrooms && (
                        <span className="mr-3">{property.bathrooms} Baths</span>
                      )}
                      {property.area && (
                        <span>{property.area} sqft</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Property</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Details</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{property.title}</td>
                      <td className="py-3 px-4 capitalize">{property.type}</td>
                      <td className="py-3 px-4">{formatPrice(property.price)}</td>
                      <td className="py-3 px-4 capitalize">{property.status}</td>
                      <td className="py-3 px-4">
                        {property.bedrooms && `${property.bedrooms} bed`}
                        {property.bathrooms && ` · ${property.bathrooms} bath`}
                        {property.area && ` · ${property.area} sqft`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyList;
