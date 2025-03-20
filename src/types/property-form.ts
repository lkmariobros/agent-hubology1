
import { z } from 'zod';

// Common property fields validation schema
export const commonPropertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  transactionType: z.enum(['Sale', 'Rent']),
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

// Union type for all property types
export type PropertyFormData = 
  | z.infer<typeof residentialPropertySchema>
  | z.infer<typeof commercialPropertySchema>
  | z.infer<typeof industrialPropertySchema>
  | z.infer<typeof landPropertySchema>;

// Property images type
export interface PropertyImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
  isCover: boolean;
}

// Property document type
export interface PropertyDocument {
  id?: string;
  file?: File;
  name: string;
  documentType: string;
  url?: string;
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
