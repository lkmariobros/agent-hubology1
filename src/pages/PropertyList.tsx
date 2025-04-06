
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilterBar } from '@/components/property/PropertyFilterBar';
import { Property } from '@/types';

const PropertyList = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: { min: 0, max: 10000000 },
    bedrooms: 0,
    bathrooms: 0
  });

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Handle view mode change
  const handleViewChange = (view: 'grid' | 'map') => {
    setViewMode(view);
  };

  // Sample property data
  const properties: Property[] = [
    {
      id: "1",
      title: "Modern Apartment in Downtown",
      description: "A beautiful modern apartment in the heart of downtown with amazing views.",
      price: 450000,
      type: "residential",
      bedrooms: 2,
      bathrooms: 2,
      builtUpArea: 1200,
      area: 1200,
      images: ["/properties/apartment-1.jpg", "/properties/apartment-2.jpg"],
      status: "available",
      features: ["Balcony", "Gym", "Pool"],
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      createdAt: "2023-01-15T08:00:00Z",
      updatedAt: "2023-01-15T08:00:00Z",
      listedBy: "John Doe",
      subtype: "Apartment"
    },
    {
      id: "2",
      title: "Luxury Villa with Pool",
      description: "Spacious luxury villa with private pool and garden in a gated community.",
      price: 1250000,
      type: "residential",
      bedrooms: 4,
      bathrooms: 3,
      builtUpArea: 3500,
      area: 3500,
      images: ["/properties/villa-1.jpg", "/properties/villa-2.jpg"],
      status: "available",
      features: ["Pool", "Garden", "Security"],
      address: {
        street: "456 Palm Ave",
        city: "Miami",
        state: "FL",
        zip: "33101",
        country: "USA"
      },
      createdAt: "2023-02-10T10:30:00Z",
      updatedAt: "2023-02-10T10:30:00Z",
      listedBy: "Jane Smith",
      subtype: "Villa"
    },
    {
      id: "3",
      title: "Commercial Office Space",
      description: "Prime location office space ready for immediate occupancy.",
      price: 750000,
      type: "commercial",
      bedrooms: 0,
      bathrooms: 2,
      builtUpArea: 2500,
      area: 2500,
      images: ["/properties/office-1.jpg"],
      status: "available",
      features: ["Parking", "24/7 Access", "Elevator"],
      address: {
        street: "789 Business Blvd",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA"
      },
      createdAt: "2023-03-05T14:15:00Z",
      updatedAt: "2023-03-05T14:15:00Z",
      listedBy: "Robert Wilson",
      subtype: "Office"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Properties</h1>
      
      <PropertyFilterBar 
        onFilter={handleFilterChange} 
        onViewChange={handleViewChange} 
        currentView={viewMode}
        filters={filters}
      />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <PropertyGrid properties={properties} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyList;
