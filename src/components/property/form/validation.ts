
import { z } from 'zod';
import { basePropertySchema, validatePricing, typeSpecificValidation } from './schemas/basePropertySchema';
import { propertySubtypes, getFeaturesByType } from './schemas/propertyTypes';
import { 
  basicInfoSchema, 
  residentialDetailsSchema, 
  commercialDetailsSchema,
  landDetailsSchema, 
  addressSchema, 
  mediaSchema,
  contactsSchema
} from './schemas/stepSchemas';

// Re-export everything from the schemas directory
export {
  basePropertySchema,
  validatePricing,
  typeSpecificValidation,
  propertySubtypes,
  getFeaturesByType,
  basicInfoSchema,
  residentialDetailsSchema,
  commercialDetailsSchema,
  landDetailsSchema,
  addressSchema,
  mediaSchema,
  contactsSchema
};

// Create a combined schema for a complete property form
export const propertySchema = z.object({
  // Basic info
  title: basicInfoSchema.shape.title,
  description: basicInfoSchema.shape.description,
  propertyType: basicInfoSchema.shape.propertyType,
  transactionType: basicInfoSchema.shape.transactionType,
  status: basicInfoSchema.shape.status,
  
  // Property details
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  bedrooms: residentialDetailsSchema.shape.bedrooms,
  bathrooms: residentialDetailsSchema.shape.bathrooms,
  builtUpArea: residentialDetailsSchema.shape.builtUpArea,
  floorArea: commercialDetailsSchema.shape.floorArea,
  landSize: landDetailsSchema.shape.landSize,
  
  // Address
  address: addressSchema.shape.address,
  
  // Media
  images: mediaSchema.shape.images,
  
  // Features
  features: z.array(z.string()).default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
