
import { z } from 'zod';

/**
 * Base property schema that defines common validation rules for properties
 * regardless of their type (Residential, Commercial, Industrial, Land)
 */
export const basePropertySchema = z.object({
  // Basic Property Information
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  propertyType: z.enum(['Residential', 'Commercial', 'Industrial', 'Land'], {
    errorMap: () => ({ message: 'Please select a property type' })
  }),
  
  transactionType: z.enum(['Sale', 'Rent', 'Primary'], {
    errorMap: () => ({ message: 'Please select a transaction type' })
  }),
  
  status: z.enum(['Available', 'Under Offer', 'Pending', 'Sold', 'Rented'], {
    errorMap: () => ({ message: 'Please select a status' })
  }).default('Available'),
  
  featured: z.boolean().default(false),
  
  // Price information based on transaction type
  price: z.number()
    .positive('Price must be greater than 0')
    .nullable()
    .optional(),
  
  rentalRate: z.number()
    .positive('Rental rate must be greater than 0')
    .nullable()
    .optional(),
  
  // Location information
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('Malaysia'),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
  
  // Owner contact information
  ownerContacts: z.array(
    z.object({
      name: z.string().min(1, 'Contact name is required'),
      role: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email('Invalid email').optional(),
    })
  ).default([]),
  
  // Features and amenities
  features: z.array(z.string()).default([]),
  
  // Media
  images: z.array(z.string()).default([]),
  
  // Agent notes (private)
  agentNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
  
  // Documents
  documents: z.array(z.string()).default([]),
});

/**
 * Type definition for the base property schema
 */
export type BasePropertyFormData = z.infer<typeof basePropertySchema>;

/**
 * Conditional validator for price/rentalRate based on transactionType
 */
export const validatePricing = (data: { transactionType: string; price?: number | null; rentalRate?: number | null }) => {
  if (data.transactionType === 'Sale' && (!data.price || data.price <= 0)) {
    return { success: false, error: 'A valid price is required for sale properties' };
  }
  
  if (data.transactionType === 'Rent' && (!data.rentalRate || data.rentalRate <= 0)) {
    return { success: false, error: 'A valid rental rate is required for rental properties' };
  }
  
  return { success: true };
};

/**
 * Type-specific schema validators
 */
export const typeSpecificValidation = {
  Residential: (data: any) => {
    if (!data.bedrooms) return { success: false, error: 'Number of bedrooms is required' };
    if (!data.bathrooms) return { success: false, error: 'Number of bathrooms is required' };
    if (!data.builtUpArea) return { success: false, error: 'Built-up area is required' };
    return { success: true };
  },
  
  Commercial: (data: any) => {
    if (!data.floorArea) return { success: false, error: 'Floor area is required' };
    return { success: true };
  },
  
  Industrial: (data: any) => {
    if (!data.landArea) return { success: false, error: 'Land area is required' };
    return { success: true };
  },
  
  Land: (data: any) => {
    if (!data.landSize) return { success: false, error: 'Land size is required' };
    return { success: true };
  }
};
