
import { Property } from '@/types';

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Oceanfront Villa',
    description: 'A stunning oceanfront property with panoramic views and direct beach access.',
    price: 4500000,
    address: {
      street: '123 Beachside Drive',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      country: 'USA'
    },
    images: ['/images/property1.jpg', '/images/property2.jpg'],
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 5000,
    type: 'Residential',
    status: 'Available',
    isFeatured: true,
    featured: true,
    transactionType: 'Sale',
    subtype: 'Villa'
  },
  {
    id: '2',
    title: 'Modern Downtown Apartment',
    description: 'A stylish apartment in the heart of downtown, close to all amenities.',
    price: 1200000,
    address: {
      street: '456 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    images: ['/images/property3.jpg', '/images/property4.jpg'],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    type: 'Residential',
    status: 'Under Offer',
    isFeatured: false,
    featured: false,
    transactionType: 'Sale',
    subtype: 'Apartment'
  },
  {
    id: '3',
    title: 'Spacious Suburban House',
    description: 'A large family home in a quiet suburban neighborhood with a big backyard.',
    price: 850000,
    address: {
      street: '789 Oak Avenue',
      city: 'Suburbanville',
      state: 'NJ',
      zip: '07001',
      country: 'USA'
    },
    images: ['/images/property5.jpg', '/images/property6.jpg'],
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    type: 'Residential',
    status: 'Available',
    isFeatured: true,
    featured: true,
    transactionType: 'Sale',
    subtype: 'House'
  },
  {
    id: '4',
    title: 'Charming Country Cottage',
    description: 'A cozy cottage nestled in the countryside, perfect for a weekend getaway.',
    price: 550000,
    address: {
      street: '101 Rural Route',
      city: 'Smalltown',
      state: 'VT',
      zip: '05001',
      country: 'USA'
    },
    images: ['/images/property7.jpg', '/images/property8.jpg'],
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 800,
    type: 'Residential',
    status: 'Pending',
    isFeatured: false,
    featured: false,
    transactionType: 'Sale',
    subtype: 'Cottage'
  },
  {
    id: '5',
    title: 'Elegant City Penthouse',
    description: 'An exclusive penthouse apartment with stunning city views and luxurious amenities.',
    price: 6750000,
    address: {
      street: '222 Highrise Lane',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    images: ['/images/property9.jpg', '/images/property10.jpg'],
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 3500,
    type: 'Residential',
    status: 'Sold',
    isFeatured: true,
    featured: true,
    transactionType: 'Sale',
    subtype: 'Penthouse'
  },
  {
    id: '6',
    title: 'Rustic Mountain Cabin',
    description: 'A secluded cabin in the mountains, ideal for nature lovers and outdoor enthusiasts.',
    price: 420000,
    address: {
      street: '333 Mountain Road',
      city: 'Mountainview',
      state: 'CO',
      zip: '80001',
      country: 'USA'
    },
    images: ['/images/property11.jpg', '/images/property12.jpg'],
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    type: 'Residential',
    status: 'Rented',
    isFeatured: false,
    featured: false,
    transactionType: 'Rent',
    subtype: 'Cabin'
  }
];

export default sampleProperties;
