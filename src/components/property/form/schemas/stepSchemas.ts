
import { z } from 'zod';

// Create a separate validation schema for each step of the form
export const basicInfoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  propertyType: z.string().min(1, 'Property type is required'),
  transactionType: z.enum(['Sale', 'Rent', 'Primary']),
  status: z.string(),
});

export const residentialDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  builtUpArea: z.number().min(0).optional(),
  bedrooms: z.number().min(0).int().optional(),
  bathrooms: z.number().min(0).optional(),
  furnishingStatus: z.string().optional(),
});

export const commercialDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  floorArea: z.number().min(0).optional(),
  buildingClass: z.string().optional(),
});

export const landDetailsSchema = z.object({
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  landSize: z.number().min(0).optional(),
  zoning: z.string().optional(),
});

export const addressSchema = z.object({
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('Malaysia'),
  }),
});

export const mediaSchema = z.object({
  images: z.array(z.string()).default([]),
});

export const contactsSchema = z.object({
  ownerContacts: z.array(
    z.object({
      name: z.string().min(1, 'Contact name is required'),
      role: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email('Invalid email').optional(),
    })
  ).optional(),
  agentNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
});
