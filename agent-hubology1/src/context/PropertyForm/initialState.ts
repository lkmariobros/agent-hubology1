
import { PropertyFormState, PropertyFormData } from '../../types/property-form';

export const initialPropertyFormState: PropertyFormState = {
  formData: {
    title: '',
    description: '',
    transactionType: 'Sale',
    propertyType: 'Residential',
    featured: false,
    status: 'Available',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'Malaysia',
    },
    price: null,
    rentalRate: null,
    agentNotes: '',
    ownerContacts: [],
    
    // Residential specific fields
    bedrooms: 0,
    bathrooms: 0,
    builtUpArea: 0,
    furnishingStatus: 'Unfurnished',
  },
  images: [],
  documents: [],
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null,
};

// This function returns a new form data object with appropriate fields initialized
// based on the selected property type
export const getInitialPropertyData = (
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land'
): PropertyFormData => {
  // Start with base common fields
  const baseData: PropertyFormData = {
    title: '',
    description: '',
    transactionType: 'Sale',
    propertyType,
    featured: false,
    status: 'Available',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'Malaysia',
    },
    price: null,
    rentalRate: null,
    agentNotes: '',
    ownerContacts: [],
  };

  // Add type-specific fields
  switch (propertyType) {
    case 'Residential':
      return {
        ...baseData,
        bedrooms: 0,
        bathrooms: 0,
        builtUpArea: 0,
        furnishingStatus: 'Unfurnished',
      };
    case 'Commercial':
      return {
        ...baseData,
        floorArea: 0,
        buildingClass: 'Class A',
      };
    case 'Industrial':
      return {
        ...baseData,
        landArea: 0,
        ceilingHeight: 0,
        loadingBays: 0,
      };
    case 'Land':
      return {
        ...baseData,
        landSize: 0,
      };
    default:
      return baseData;
  }
};
