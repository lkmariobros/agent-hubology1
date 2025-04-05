
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

// Enhanced Zod validation schema for property form with better error messages
export const propertySchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  
  propertyType: z.string()
    .min(1, 'Property type is required'),
  
  transactionType: z.enum(['Sale', 'Rent', 'Primary'], {
    errorMap: () => ({ message: 'Transaction type must be selected' })
  }),
  
  // Conditional price validation based on transaction type
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  })
    .min(0, 'Price cannot be negative')
    .nullable()
    .optional(),
  
  rentalRate: z.number({
    invalid_type_error: "Rental rate must be a number",
  })
    .min(0, 'Rental rate cannot be negative')
    .nullable()
    .optional(),
  
  status: z.string({
    required_error: "Status is required"
  }),
  
  // Property details
  builtUpArea: z.number({
    invalid_type_error: "Built-up area must be a number",
  })
    .min(0, 'Built-up area cannot be negative')
    .optional(),
  
  bedrooms: z.number({
    invalid_type_error: "Bedrooms must be a number",
  })
    .min(0, 'Bedrooms cannot be negative')
    .int('Bedrooms must be a whole number')
    .optional(),
  
  bathrooms: z.number({
    invalid_type_error: "Bathrooms must be a number",
  })
    .min(0, 'Bathrooms cannot be negative')
    .optional(),
  
  features: z.array(z.string()).default([]),
  
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('Malaysia'),
  }, {
    required_error: "Address is required",
    invalid_type_error: "Address must be an object",
  }),
  
  images: z.array(z.string()).default([]),
  
  // Additional fields for specific property types
  furnishingStatus: z.string().optional(),
  floorArea: z.number().min(0).optional(),
  landSize: z.number().min(0).optional(),
  buildingClass: z.string().optional(),
  zoning: z.string().optional(),
  
  // Owner contact information
  ownerContacts: z.array(
    z.object({
      name: z.string().min(1, 'Contact name is required'),
      role: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email('Invalid email').optional(),
    })
  ).optional(),
  
  // Agent notes
  agentNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
}).refine(
  (data) => {
    // For sale properties, price is required
    if (data.transactionType === 'Sale') {
      return data.price != null && data.price > 0;
    }
    // For rental properties, rental rate is required
    if (data.transactionType === 'Rent') {
      return data.rentalRate != null && data.rentalRate > 0;
    }
    return true;
  },
  {
    message: "A valid price is required for sale properties, or rental rate for rental properties",
    path: ["price"],
  }
);

// Create a separate validation schema for each step of the form
// Use the proper way to extract fields from the schema
const baseSchema = propertySchema;

export const basicInfoSchema = z.object({
  title: baseSchema.shape.title,
  description: baseSchema.shape.description,
  propertyType: baseSchema.shape.propertyType,
  transactionType: baseSchema.shape.transactionType,
  status: baseSchema.shape.status,
});

export const residentialDetailsSchema = z.object({
  price: baseSchema.shape.price,
  rentalRate: baseSchema.shape.rentalRate,
  builtUpArea: baseSchema.shape.builtUpArea,
  bedrooms: baseSchema.shape.bedrooms,
  bathrooms: baseSchema.shape.bathrooms,
  furnishingStatus: baseSchema.shape.furnishingStatus,
});

export const commercialDetailsSchema = z.object({
  price: baseSchema.shape.price,
  rentalRate: baseSchema.shape.rentalRate,
  floorArea: baseSchema.shape.floorArea,
  buildingClass: baseSchema.shape.buildingClass,
});

export const landDetailsSchema = z.object({
  price: baseSchema.shape.price,
  rentalRate: baseSchema.shape.rentalRate,
  landSize: baseSchema.shape.landSize,
  zoning: baseSchema.shape.zoning,
});

export const addressSchema = z.object({
  address: baseSchema.shape.address,
});

export const mediaSchema = z.object({
  images: baseSchema.shape.images,
});

export const contactsSchema = z.object({
  ownerContacts: baseSchema.shape.ownerContacts,
  agentNotes: baseSchema.shape.agentNotes,
});
