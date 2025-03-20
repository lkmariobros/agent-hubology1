
import * as z from 'zod';

// Validation schema - simplified for essential fields
export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  type: z.enum(['residential', 'commercial', 'industrial', 'land']),
  subtype: z.string().min(1, 'Subtype is required'),
  area: z.coerce.number().min(1, 'Area must be greater than 0'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  features: z.array(z.string()).default([]),
  status: z.enum(['available', 'pending', 'sold']).default('available'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP/Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

// Data for property types
export const propertySubtypes = {
  residential: ['Apartment', 'House', 'Townhouse', 'Condominium', 'Villa'],
  commercial: ['Office', 'Retail', 'Restaurant', 'Hotel', 'Mixed Use'],
  industrial: ['Warehouse', 'Factory', 'Workshop', 'Distribution Center'],
  land: ['Residential Land', 'Commercial Land', 'Agricultural Land', 'Industrial Land'],
};

// Common features for different property types
export const commonFeatures = [
  { id: 'parking', label: 'Parking' },
  { id: 'security', label: 'Security System' },
  { id: 'aircon', label: 'Air Conditioning' },
];

export const residentialFeatures = [
  { id: 'furnished', label: 'Furnished' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'garden', label: 'Garden' },
];

export const commercialFeatures = [
  { id: 'reception', label: 'Reception Area' },
  { id: 'conferenceRoom', label: 'Conference Room' },
  { id: 'kitchenette', label: 'Kitchenette' },
];

export const industrialFeatures = [
  { id: 'loading', label: 'Loading Dock' },
  { id: 'highCeiling', label: 'High Ceiling' },
  { id: 'heavyPower', label: 'Heavy Power Supply' },
];

export const landFeatures = [
  { id: 'waterAccess', label: 'Water Access' },
  { id: 'roadFrontage', label: 'Road Frontage' },
  { id: 'cleared', label: 'Cleared Land' },
];

export const getFeaturesByType = (propertyType: string) => {
  switch (propertyType) {
    case 'residential':
      return [...commonFeatures, ...residentialFeatures];
    case 'commercial':
      return [...commonFeatures, ...commercialFeatures];
    case 'industrial':
      return [...commonFeatures, ...industrialFeatures];
    case 'land':
      return landFeatures;
    default:
      return commonFeatures;
  }
};
