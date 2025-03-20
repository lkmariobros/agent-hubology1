
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
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1638623383685-6ac06569e100?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    features: ['Loading Docks', 'High Ceiling', 'Climate Control'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Williams'
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
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlbnRob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    features: ['Private Elevator', 'Rooftop Terrace', 'Smart Home'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Garcia'
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
    images: [
      'https://images.unsplash.com/photo-1604521693763-50c6dd69ea19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmV0YWlsJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmV0YWlsJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'available',
    features: ['High Foot Traffic', 'Storage Room', 'Display Windows'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Davis'
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
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjdG9yeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjdG9yeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    status: 'sold',
    features: ['Loading Bays', 'Office Space', 'Heavy Power'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Miller'
  }
];
