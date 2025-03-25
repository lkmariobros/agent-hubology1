import { z } from 'zod';

// Common property fields validation schema
export const commonPropertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  transactionType: z.enum(['Sale', 'Rent', 'Primary']),
  propertyType: z.enum(['Residential', 'Commercial', 'Industrial', 'Land']),
  featured: z.boolean().default(false),
  status: z.enum(['Available', 'Under Offer', 'Pending', 'Sold', 'Rented']),
  
  // Address fields
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().optional(),
    country: z.string().default('Malaysia'),
  }),
  
  // Price fields - conditional based on transaction type
  price: z.number().nullable().optional(),
  rentalRate: z.number().nullable().optional(),
  
  // Agent notes
  agentNotes: z.string().optional(),

  // Owner contact information
  ownerContacts: z.array(z.object({
    name: z.string().min(1, 'Contact name is required'),
    role: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
  })).default([]),
  
  // Stock information for development properties
  stock: z.object({
    total: z.number().int().min(0).default(0),
    available: z.number().int().min(0).default(0),
    reserved: z.number().int().min(0).default(0),
    sold: z.number().int().min(0).default(0)
  }).optional(),
});

// Residential property specific fields
export const residentialPropertySchema = commonPropertySchema.extend({
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  builtUpArea: z.number().min(0),
  furnishingStatus: z.enum(['Unfurnished', 'Partially Furnished', 'Fully Furnished']),
});

// Commercial property specific fields
export const commercialPropertySchema = commonPropertySchema.extend({
  floorArea: z.number().min(0),
  zoningType: z.string().optional(),
  buildingClass: z.enum(['Class A', 'Class B', 'Class C']).optional(),
});

// Industrial property specific fields
export const industrialPropertySchema = commonPropertySchema.extend({
  landArea: z.number().min(0),
  ceilingHeight: z.number().min(0).optional(),
  loadingBays: z.number().int().min(0).optional(),
  powerCapacity: z.string().optional(),
});

// Land property specific fields
export const landPropertySchema = commonPropertySchema.extend({
  landSize: z.number().min(0),
  zoning: z.string().optional(),
  roadFrontage: z.number().min(0).optional(),
  topography: z.string().optional(),
});

// Owner contact type
export interface OwnerContact {
  id?: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

// Stock information type
export interface PropertyStock {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}

// Union type for all property types
export type PropertyFormData = {
  title: string;
  description: string;
  transactionType: 'Sale' | 'Rent' | 'Primary';
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  featured: boolean;
  status: 'Available' | 'Under Offer' | 'Pending' | 'Sold' | 'Rented';
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  price: number | null;
  rentalRate: number | null;
  agentNotes: string;
  ownerContacts: OwnerContact[];
  
  // Stock information for development properties
  stock?: PropertyStock;
  
  // Residential specific fields
  bedrooms?: number;
  bathrooms?: number;
  builtUpArea?: number;
  furnishingStatus?: 'Unfurnished' | 'Partially Furnished' | 'Fully Furnished';
  
  // Commercial specific fields
  floorArea?: number;
  zoningType?: string;
  buildingClass?: 'Class A' | 'Class B' | 'Class C';
  
  // Industrial specific fields
  landArea?: number;
  ceilingHeight?: number;
  loadingBays?: number;
  powerCapacity?: string;
  
  // Land specific fields
  landSize?: number;
  zoning?: string;
  roadFrontage?: number;
  topography?: string;
  
  // Additional properties for update operations
  images?: PropertyImage[];
  documents?: PropertyDocument[];
  imagesToDelete?: string[];
  documentsToDelete?: string[];
};

// Property images type
export interface PropertyImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
  isCover: boolean;
  storagePath?: string;
}

// Property document type
export interface PropertyDocument {
  id?: string;
  file?: File;
  name: string;
  documentType: string;
  url?: string;
  storagePath?: string;
}

// Property form state interface
export interface PropertyFormState {
  formData: PropertyFormData;
  images: PropertyImage[];
  documents: PropertyDocument[];
  currentStep: number;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
}

// Property form context interface
export interface PropertyFormContextType {
  state: PropertyFormState;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  updatePropertyType: (type: 'Residential' | 'Commercial' | 'Industrial' | 'Land') => void;
  updateTransactionType: (type: 'Sale' | 'Rent') => void;
  addImage: (image: PropertyImage) => void;
  removeImage: (index: number) => void;
  setCoverImage: (index: number) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
  addDocument: (document: PropertyDocument) => void;
  removeDocument: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
}
