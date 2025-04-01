
import React from 'react';
import { Property } from '@/types';
import PropertyGrid from '@/components/property/PropertyGrid';
import { Button } from '@/components/ui/button';

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in City Center',
    description: 'A beautiful modern apartment with stunning views of the city skyline.',
    price: 450000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['/images/properties/apartment1.jpg'],
    status: 'Available',
    features: ['balcony', 'parking', 'gym'],
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Spacious Family House with Garden',
    description: 'Perfect family home with a large garden in a quiet neighborhood.',
    price: 750000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: ['/images/properties/house1.jpg'],
    status: 'Available',
    features: ['garden', 'garage', 'fireplace'],
    address: {
      street: '456 Oak Avenue',
      city: 'Boston',
      state: 'MA',
      country: 'USA'
    },
    createdAt: '2023-01-20T14:30:00Z',
    updatedAt: '2023-01-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Downtown Studio Loft',
    description: 'Stylish studio loft in the heart of the entertainment district.',
    price: 320000,
    type: 'loft',
    bedrooms: 0,
    bathrooms: 1,
    area: 800,
    images: ['/images/properties/loft1.jpg'],
    status: 'Pending',
    features: ['security', 'elevator', 'concierge'],
    address: {
      street: '789 Broadway',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    createdAt: '2023-01-25T09:15:00Z',
    updatedAt: '2023-01-25T09:15:00Z'
  }
];

const PropertyList = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Featured Properties</h1>
        <Button>View All</Button>
      </div>

      <PropertyGrid properties={SAMPLE_PROPERTIES} />
    </div>
  );
};

export default PropertyList;
