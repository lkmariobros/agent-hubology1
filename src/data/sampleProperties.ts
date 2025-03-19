
import { Property } from '@/types';

// Sample properties data
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
