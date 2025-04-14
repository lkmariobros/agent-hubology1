
import { z } from 'zod';

// Create a separate validation schema for each step of the form
export const basicInfoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  propertyType: z.string().min(1, 'Property type is required'),
  transactionType: z.enum(['Sale', 'Rent', 'Primary']),
  status: z.enum(['Available', 'Under Offer', 'Pending', 'Sold', 'Rented']).default('Available'),
});

export const residentialDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  builtUpArea: z.number().min(0, 'Built-up area must be greater than 0').optional(),
  bedrooms: z.number().min(0).int('Bedrooms must be a whole number').optional(),
  bathrooms: z.number().min(0, 'Bathrooms must be greater than 0').optional(),
  furnishingStatus: z.enum(['Unfurnished', 'Partially Furnished', 'Fully Furnished']).optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
});

export const commercialDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  floorArea: z.number().min(0, 'Floor area must be greater than 0').optional(),
  buildingClass: z.enum(['A', 'B', 'C']).optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  isFreehold: z.boolean().optional(),
  leaseTerm: z.number().int().min(0).optional().nullable(),
});

export const industrialDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  landArea: z.number().min(0, 'Land area must be greater than 0').optional(),
  buildingArea: z.number().min(0).optional(),
  ceilingHeight: z.number().min(0).optional(),
  loadingBays: z.number().int().min(0).optional(),
  powerCapacity: z.string().optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
});

export const landDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  landSize: z.number().min(0, 'Land size must be greater than 0').optional(),
  zoning: z.string().optional(),
  zoningType: z.enum(['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed']).optional(),
  isFreehold: z.boolean().optional(),
  roadFrontage: z.number().min(0).optional(),
  topography: z.string().optional(),
});

export const addressSchema = z.object({
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('Malaysia'),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
});

export const mediaSchema = z.object({
  images: z.array(z.string()).default([]),
  mainImage: z.string().optional(),
});

export const contactsSchema = z.object({
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
      email: z.string().email('Invalid email').optional(),
    })
  ).optional(),
  agentNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
});
