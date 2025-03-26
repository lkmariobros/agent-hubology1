
import { z } from 'zod';

// Property subtypes by property type
export const propertySubtypes = {
  residential: ['Apartment', 'House', 'Townhouse', 'Condo', 'Villa'],
  commercial: ['Office', 'Retail', 'Restaurant', 'Warehouse', 'Mixed Use'],
  industrial: ['Factory', 'Workshop', 'Storage', 'Distribution Center'],
  land: ['Residential Land', 'Commercial Land', 'Agricultural Land', 'Development Site']
};

// Common features by property type
export const getFeaturesByType = (type: string) => {
  const commonFeatures = [
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: 'Security System' },
    { id: 'highSpeedInternet', label: 'High-Speed Internet' },
  ];

  const typeSpecificFeatures = {
    residential: [
      { id: 'airConditioning', label: 'Air Conditioning' },
      { id: 'furnishing', label: 'Furnished' },
      { id: 'balcony', label: 'Balcony' },
      { id: 'pool', label: 'Swimming Pool' },
      { id: 'gym', label: 'Gym' },
      { id: 'petFriendly', label: 'Pet Friendly' },
    ],
    commercial: [
      { id: 'elevators', label: 'Elevators' },
      { id: 'conferenceRooms', label: 'Conference Rooms' },
      { id: 'reception', label: 'Reception Area' },
      { id: '24HourAccess', label: '24-Hour Access' },
      { id: 'kitchenette', label: 'Kitchenette' },
    ],
    industrial: [
      { id: 'loadingDocks', label: 'Loading Docks' },
      { id: 'highCeilings', label: 'High Ceilings' },
      { id: 'heavyPower', label: 'Heavy Power Supply' },
      { id: 'craneSystem', label: 'Crane System' },
    ],
    land: [
      { id: 'roadAccess', label: 'Road Access' },
      { id: 'utilities', label: 'Utilities Available' },
      { id: 'fenced', label: 'Fenced' },
      { id: 'cleared', label: 'Cleared' },
    ]
  };

  if (type in typeSpecificFeatures) {
    return [...commonFeatures, ...typeSpecificFeatures[type as keyof typeof typeSpecificFeatures]];
  }
  
  return commonFeatures;
};

// Zod validation schema for property form
export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  type: z.enum(['residential', 'commercial', 'industrial', 'land']),
  status: z.string(),
  area: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  features: z.array(z.string()).default([]),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('USA'),
  }),
  images: z.array(z.string()).default([]),
});
