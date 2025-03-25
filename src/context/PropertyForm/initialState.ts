
import { PropertyFormState } from '../../types/property-form';

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
