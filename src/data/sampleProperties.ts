
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
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
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
    images: ['/placeholder.svg', '/placeholder.svg'],
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
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
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
    images: ['/placeholder.svg', '/placeholder.svg'],
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
    images: ['/placeholder.svg'],
    status: 'sold',
    features: ['Loading Bays', 'Office Space', 'Heavy Power'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listedBy: 'Agent Miller'
  }
];
