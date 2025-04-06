
import { PropertyFormState } from '@/types/property-form';

export const initialPropertyFormState: PropertyFormState = {
  currentStep: 0,
  formData: {
    title: '',
    description: '',
    propertyType: 'Residential',
    transactionType: 'Sale',
    status: 'Available',
    featured: false,
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'Malaysia',
    },
    // Residential specific fields
    bedrooms: 0,
    bathrooms: 0,
    builtUpArea: 0,
    furnishingStatus: 'Unfurnished',
    constructionYear: new Date().getFullYear(),
    
    // Commercial specific fields
    floorArea: 0,
    zoningType: '',
    buildingClass: '',
    
    // Industrial specific fields
    landArea: 0,
    ceilingHeight: 0,
    loadingBays: 0,
    powerCapacity: '',
    
    // Land specific fields
    landSize: 0,
    zoning: '',
    roadFrontage: 0,
    topography: '',
    freehold: false,
    
    // Financial fields
    price: 0,
    rentalRate: 0,
    
    // Additional fields
    agentNotes: '',
    
    // Owner information
    owner: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      isPrimaryContact: false
    },
    
    // Property features
    propertyFeatures: [],
    
    // Owner contacts
    ownerContacts: [],
    
    // Stock for Primary market properties
    stock: {
      total: 0,
      available: 0,
      reserved: 0,
      sold: 0
    }
  },
  images: [],
  documents: [],
  isDirty: false,
  isSubmitting: false,
  lastSaved: null,
};
