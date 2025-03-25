
import { Property } from '@/types';

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    description: 'A stunning beachfront villa with panoramic ocean views and private beach access.',
    type: 'residential',
    subtype: 'Villa',
    status: 'available',
    transactionType: 'sale',
    price: 2500000,
    address: {
      street: '123 Ocean Drive',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      country: 'USA'
    },
    features: {
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 4200,
      landSize: 0.75
    },
    agent: {
      id: 'agent1',
      name: 'John Smith'
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
    ],
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-06-01T14:20:00Z',
    featured: true,
    size: 4200,
    area: 4200,
    bedrooms: 5,
    bathrooms: 4,
    listedBy: {
      id: 'agent1',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: '2',
    title: 'Modern Downtown Condo',
    description: 'Sleek modern condo in the heart of downtown with city views and upscale amenities.',
    type: 'residential',
    subtype: 'Condominium',
    status: 'available',
    transactionType: 'sale',
    price: 850000,
    address: {
      street: '456 High Street, Unit 1201',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'USA'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1100,
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'
    ],
    createdAt: '2023-06-10T09:15:00Z',
    updatedAt: '2023-06-15T11:40:00Z',
    featured: false,
    size: 1100,
    area: 1100,
    bedrooms: 2,
    bathrooms: 2,
    listedBy: {
      id: 'agent2',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  },
  {
    id: '3',
    title: 'Riverside Family Home',
    description: 'Spacious family home on the river with large garden and outdoor entertainment area.',
    type: 'residential',
    subtype: 'Single Family Home',
    status: 'available',
    transactionType: 'sale',
    price: 1250000,
    address: {
      street: '789 River Road',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'USA'
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2800,
      landSize: 0.5
    },
    agent: {
      id: 'agent3',
      name: 'Mike Wilson'
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126'
    ],
    createdAt: '2023-05-20T14:45:00Z',
    updatedAt: '2023-06-02T10:30:00Z',
    featured: true,
    size: 2800,
    area: 2800,
    bedrooms: 4,
    bathrooms: 3,
    listedBy: {
      id: 'agent3',
      name: 'Mike Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  },
  {
    id: '4',
    title: 'Prime Office Space',
    description: 'Premium office space in Class A building with modern amenities and central location.',
    type: 'commercial',
    subtype: 'Office',
    status: 'available',
    transactionType: 'lease',
    price: 35000,
    rentalRate: 35,
    address: {
      street: '100 Commerce Plaza, 15th Floor',
      city: 'Chicago',
      state: 'IL',
      zip: '60611',
      country: 'USA'
    },
    features: {
      squareFeet: 5000,
    },
    agent: {
      id: 'agent4',
      name: 'Jessica Brown'
    },
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36'
    ],
    createdAt: '2023-05-25T08:20:00Z',
    updatedAt: '2023-06-05T16:10:00Z',
    featured: true,
    size: 5000,
    area: 5000,
    listedBy: {
      id: 'agent4',
      name: 'Jessica Brown',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: '5',
    title: 'Retail Space in Shopping District',
    description: 'High-traffic retail location in popular shopping district with storefront visibility.',
    type: 'commercial',
    subtype: 'Retail',
    status: 'available',
    transactionType: 'lease',
    price: 8500,
    rentalRate: 42,
    address: {
      street: '222 Retail Row',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90048',
      country: 'USA'
    },
    features: {
      squareFeet: 2400,
    },
    agent: {
      id: 'agent5',
      name: 'David Chen'
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      'https://images.unsplash.com/photo-1595361315589-a12e91cdc5e9',
      'https://images.unsplash.com/photo-1535959005677-e5ee1a8b54da'
    ],
    createdAt: '2023-06-05T11:30:00Z',
    updatedAt: '2023-06-10T13:45:00Z',
    featured: false,
    size: 2400,
    area: 2400,
    listedBy: {
      id: 'agent5',
      name: 'David Chen',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  {
    id: '6',
    title: 'Industrial Warehouse',
    description: 'Modern warehouse facility with loading docks, high ceilings, and office space.',
    type: 'industrial',
    subtype: 'Warehouse',
    status: 'available',
    transactionType: 'sale',
    price: 4200000,
    address: {
      street: '555 Industrial Parkway',
      city: 'Dallas',
      state: 'TX',
      zip: '75207',
      country: 'USA'
    },
    features: {
      squareFeet: 50000,
      landSize: 3.5
    },
    agent: {
      id: 'agent1',
      name: 'John Smith'
    },
    images: [
      'https://images.unsplash.com/photo-1594616286526-a773be1b7dc1',
      'https://images.unsplash.com/photo-1593788144688-ad385e75dd23',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3'
    ],
    createdAt: '2023-05-18T15:50:00Z',
    updatedAt: '2023-06-08T09:25:00Z',
    featured: true,
    size: 50000,
    area: 50000,
    listedBy: {
      id: 'agent1',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  }
];

export default sampleProperties;
