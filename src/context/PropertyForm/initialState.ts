
import { PropertyFormData, PropertyFormState } from '../../types/property-form';

// Initial state based on property type
export const getInitialPropertyData = (propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land'): PropertyFormData => {
  const commonData = {
    title: '',
    description: '',
    transactionType: 'Sale' as const,
    propertyType: propertyType,
    featured: false,
    status: 'Available' as const,
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
  };

  switch (propertyType) {
    case 'Residential':
      return {
        ...commonData,
        bedrooms: 0,
        bathrooms: 0,
        builtUpArea: 0,
        furnishingStatus: 'Unfurnished' as const,
      };
    case 'Commercial':
      return {
        ...commonData,
        floorArea: 0,
        zoningType: '',
        buildingClass: 'Class A' as const,
      };
    case 'Industrial':
      return {
        ...commonData,
        landArea: 0,
        ceilingHeight: 0,
        loadingBays: 0,
        powerCapacity: '',
      };
    case 'Land':
      return {
        ...commonData,
        landSize: 0,
        zoning: '',
        roadFrontage: 0,
        topography: '',
      };
    default:
      return commonData as PropertyFormData;
  }
};

// Initial state
export const initialPropertyFormState: PropertyFormState = {
  formData: getInitialPropertyData('Residential'),
  images: [],
  documents: [],
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null,
};
