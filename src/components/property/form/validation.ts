
import { z } from 'zod';
import { basePropertySchema, validatePricing, typeSpecificValidation } from './schemas/basePropertySchema';
import { propertySubtypes, getFeaturesByType } from './schemas/propertyTypes';
import { 
  basicInfoSchema, 
  residentialDetailsSchema, 
  commercialDetailsSchema,
  industrialDetailsSchema,
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
  industrialDetailsSchema,
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
  
  // Property details - common
  price: z.number().min(0).nullable().optional(),
  rentalRate: z.number().min(0).nullable().optional(),
  
  // Residential details
  bedrooms: residentialDetailsSchema.shape.bedrooms,
  bathrooms: residentialDetailsSchema.shape.bathrooms,
  builtUpArea: residentialDetailsSchema.shape.builtUpArea,
  furnishingStatus: residentialDetailsSchema.shape.furnishingStatus,
  
  // Commercial details
  floorArea: commercialDetailsSchema.shape.floorArea,
  buildingClass: commercialDetailsSchema.shape.buildingClass,
  
  // Industrial details
  landArea: industrialDetailsSchema.shape.landArea,
  ceilingHeight: industrialDetailsSchema.shape.ceilingHeight,
  loadingBays: industrialDetailsSchema.shape.loadingBays,
  powerCapacity: industrialDetailsSchema.shape.powerCapacity,
  
  // Land details
  landSize: landDetailsSchema.shape.landSize,
  zoning: landDetailsSchema.shape.zoning,
  zoningType: landDetailsSchema.shape.zoningType,
  topography: landDetailsSchema.shape.topography,
  roadFrontage: landDetailsSchema.shape.roadFrontage,
  
  // Address
  address: addressSchema.shape.address,
  
  // Media
  images: mediaSchema.shape.images,
  mainImage: mediaSchema.shape.mainImage,
  
  // Contacts and notes
  ownerContacts: contactsSchema.shape.ownerContacts,
  agentNotes: contactsSchema.shape.agentNotes,
  
  // Features
  features: z.array(z.string()).default([]),
  
  // Boolean flags
  featured: z.boolean().optional().default(false),
  
  // Documents
  documents: z.array(z.any()).optional().default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

/**
 * Comprehensive validation function that combines all validations
 * Returns a standardized result with success flag and detailed error messages
 */
export const validatePropertyForm = (data: Partial<PropertyFormValues>): { 
  success: boolean; 
  errors: Record<string, string>; 
} => {
  const errors: Record<string, string> = {};
  
  // Validate with Zod schema
  try {
    propertySchema.parse(data);
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
    }
  }
  
  // Add conditional validation for pricing based on transaction type
  if (data.transactionType) {
    const pricingValidation = validatePricing({
      transactionType: data.transactionType,
      price: data.price,
      rentalRate: data.rentalRate
    });
    
    if (!pricingValidation.success && pricingValidation.error) {
      errors['pricing'] = pricingValidation.error;
    }
  }
  
  // Add type-specific validation based on property type
  if (data.propertyType) {
    const typeValidation = typeSpecificValidation[data.propertyType as keyof typeof typeSpecificValidation]?.(data);
    if (typeValidation && !typeValidation.success && typeValidation.error) {
      errors['typeSpecific'] = typeValidation.error;
    }
  }
  
  return {
    success: Object.keys(errors).length === 0,
    errors
  };
};
