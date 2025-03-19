
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PropertyFilterBar } from '@/components/property/PropertyFilterBar';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Store, Factory, Map, MapPin, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Property } from '@/types';

// Sample properties data
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with City View',
    description: 'A beautiful modern apartment in the heart of the city',
    type: 'residential',
    subtype: 'Apartment',
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    images: ['/placeholder.svg'],
    status: 'available',
    features: ['Parking', 'Pool', 'Gym'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Smith'
  },
  {
    id: '2',
    title: 'Commercial Office Space',
    description: 'Prime office space in downtown business district',
    type: 'commercial',
    subtype: 'Office',
    price: 1250000,
    area: 3000,
    address: {
      street: '456 Market Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    images: ['/placeholder.svg'],
    status: 'available',
    features: ['24/7 Access', 'Security System', 'Conference Rooms'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Johnson'
  },
  {
    id: '3',
    title: 'Industrial Warehouse',
    description: 'Large warehouse space with easy highway access',
    type: 'industrial',
    subtype: 'Warehouse',
    price: 950000,
    area: 8500,
    address: {
      street: '789 Industrial Park',
      city: 'Chicago',
      state: 'IL',
      zip: '60607',
      country: 'USA'
    },
    images: ['/placeholder.svg'],
    status: 'pending',
    features: ['Loading Docks', 'High Ceiling', 'Climate Control'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Williams'
  }
];

const Properties = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [properties] = useState<Property[]>(sampleProperties);
  
  const handleViewChange = (newView: 'grid' | 'map') => {
    setView(newView);
  };
  
  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
    // Implementation for filtering properties would go here
  };

  const getPropertyTypeIcon = (type: string) => {
    switch(type) {
      case 'residential':
        return <Building2 className="h-4 w-4" />;
      case 'commercial':
        return <Store className="h-4 w-4" />;
      case 'industrial':
        return <Factory className="h-4 w-4" />;
      case 'land':
        return <Map className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `RM ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `RM ${(price / 1000).toFixed(0)}K`;
    }
    return `RM ${price}`;
  };
  
  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal tracking-tight">Properties</h1>
          <Button 
            size="sm"
            className="gap-2" 
            onClick={() => navigate('/properties/new')}
          >
            <Plus size={16} />
            Add Property
          </Button>
        </div>
        
        <PropertyFilterBar 
          onFilter={handleFilter} 
          onViewChange={handleViewChange} 
          currentView={view}
        />
        
        <Card className="overflow-hidden">
          {view === 'grid' && (
            <div className="overflow-x-auto">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>
                      <div className="flex items-center">
                        Price <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length > 0 ? (
                    properties.map((property) => (
                      <tr key={property.id} className="cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted/30 flex items-center justify-center">
                              {getPropertyTypeIcon(property.type)}
                            </div>
                            <div>
                              <div className="font-medium">{property.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {property.bedrooms && `${property.bedrooms} bd • `}
                                {property.bathrooms && `${property.bathrooms} ba • `}
                                {property.area && `${property.area} ft²`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge variant="outline" className="capitalize bg-secondary/50">
                            {property.subtype}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{property.address.city}, {property.address.state}</span>
                          </div>
                        </td>
                        <td className="font-medium">{formatPrice(property.price)}</td>
                        <td>
                          <Badge
                            variant={property.status === 'available' ? 'default' : 'outline'}
                            className={property.status === 'pending' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : ''}
                          >
                            {property.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/properties/${property.id}/edit`);
                            }}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No properties found. Add a property to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {properties.length > 0 ? (
                properties.map(property => (
                  <div 
                    key={property.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <div className="relative h-40 bg-muted">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getPropertyTypeIcon(property.type)}
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2"
                        variant={property.status === 'available' ? 'default' : 'outline'}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{property.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{property.address.city}, {property.address.state}</span>
                      </div>
                      <div className="mt-2 font-medium">{formatPrice(property.price)}</div>
                      <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-3">
                        {property.bedrooms && (
                          <span>{property.bedrooms} bd</span>
                        )}
                        {property.bathrooms && (
                          <span>{property.bathrooms} ba</span>
                        )}
                        {property.area && (
                          <span>{property.area} ft²</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  No properties to display. Add a new property to get started.
                </p>
              )}
            </div>
          )}
          
          {view === 'map' && (
            <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Map view is currently under development
              </p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Properties;
