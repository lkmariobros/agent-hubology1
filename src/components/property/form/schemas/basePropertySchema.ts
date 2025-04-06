
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
    .optional()
    .refine(
      (val) => val === null || val === undefined || val > 0,
      'Price must be greater than 0'
    ),
  
  rentalRate: z.number()
    .positive('Rental rate must be greater than 0')
    .nullable()
    .optional()
    .refine(
      (val) => val === null || val === undefined || val > 0,
      'Rental rate must be greater than 0'
    ),
  
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
      phone: z.string()
        .optional()
        .refine(
          (val) => !val || /^(\+?6?01[0-46-9]-?\d{7,8}|\+?60\d{2}-?\d{7})$/.test(val),
          { message: 'Please enter a valid Malaysian phone number' }
        ),
      email: z.string()
        .email('Invalid email')
        .optional(),
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
 * Returns a standardized result object with success flag and error message
 */
export const validatePricing = (data: { transactionType: string; price?: number | null; rentalRate?: number | null }) => {
  if (data.transactionType === 'Sale' && (!data.price || data.price <= 0)) {
    return { success: false, error: 'A valid price is required for sale properties' };
  }
  
  if (data.transactionType === 'Rent' && (!data.rentalRate || data.rentalRate <= 0)) {
    return { success: false, error: 'A valid rental rate is required for rental properties' };
  }
  
  return { success: true, error: null };
};

/**
 * Type-specific schema validators with standardized return format
 */
export const typeSpecificValidation = {
  Residential: (data: any) => {
    const errors = [];
    
    if (!data.bedrooms) errors.push('Number of bedrooms is required');
    if (!data.bathrooms) errors.push('Number of bathrooms is required');
    if (!data.builtUpArea) errors.push('Built-up area is required');
    
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }
    
    return { success: true, error: null };
  },
  
  Commercial: (data: any) => {
    const errors = [];
    
    if (!data.floorArea) errors.push('Floor area is required');
    
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }
    
    return { success: true, error: null };
  },
  
  Industrial: (data: any) => {
    const errors = [];
    
    if (!data.landArea) errors.push('Land area is required');
    if (data.ceilingHeight && data.ceilingHeight <= 0) errors.push('Ceiling height must be greater than 0');
    
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }
    
    return { success: true, error: null };
  },
  
  Land: (data: any) => {
    const errors = [];
    
    if (!data.landSize) errors.push('Land size is required');
    
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }
    
    return { success: true, error: null };
  }
};
