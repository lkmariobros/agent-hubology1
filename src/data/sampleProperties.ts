import { Property } from '@/types';

// Sample properties data with more realistic images
export const sampleProperties: Property[] = [
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
    features: {
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    agent: {
      id: '1',
      name: 'Agent Smith'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Smith',
    transactionType: 'Sale'
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
    features: {
      squareFeet: 3000,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    agent: {
      id: '2',
      name: 'Agent Johnson'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Johnson',
    transactionType: 'Sale'
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
    features: {
      squareFeet: 8500,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1638623383685-6ac06569e100?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    agent: {
      id: '3',
      name: 'Agent Williams'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Williams',
    transactionType: 'Sale'
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    description: 'Stunning penthouse with panoramic ocean views',
    type: 'residential',
    subtype: 'Penthouse',
    price: 3200000,
    bedrooms: 4,
    bathrooms: 4.5,
    area: 3500,
    address: {
      street: '1000 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zip: '33139',
      country: 'USA'
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      squareFeet: 3500,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlbnRob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    agent: {
      id: '4',
      name: 'Agent Garcia'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Garcia',
    transactionType: 'Sale'
  },
  {
    id: '5',
    title: 'Retail Space in Mall',
    description: 'High-traffic retail space in premium shopping mall',
    type: 'commercial',
    subtype: 'Retail',
    price: 750000,
    area: 1800,
    address: {
      street: '200 Shopping Center Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90045',
      country: 'USA'
    },
    features: {
      squareFeet: 1800,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1604521693763-50c6dd69ea19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmV0YWlsJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmV0YWlsJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    agent: {
      id: '5',
      name: 'Agent Davis'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Davis',
    transactionType: 'Sale'
  },
  {
    id: '6',
    title: 'Manufacturing Facility',
    description: 'Turnkey manufacturing facility with modern equipment',
    type: 'industrial',
    subtype: 'Manufacturing',
    price: 2100000,
    area: 15000,
    address: {
      street: '500 Industry Road',
      city: 'Detroit',
      state: 'MI',
      zip: '48201',
      country: 'USA'
    },
    features: {
      squareFeet: 15000,
      landSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjdG9yeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjdG9yeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'sold',
    agent: {
      id: '6',
      name: 'Agent Miller'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Miller',
    transactionType: 'Sale'
  }
];
