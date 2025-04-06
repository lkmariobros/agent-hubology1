
export interface PropertyFormData {
  title: string;
  description: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  transactionType: 'Sale' | 'Rent';
  status: string;
  featured: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  // Residential specific fields
  bedrooms?: number;
  bathrooms?: number;
  builtUpArea?: number;
  furnishingStatus?: string;
  
  // Commercial specific fields
  floorArea?: number;
  zoningType?: string;
  buildingClass?: string;
  
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
  
  // Financial fields
  price?: number;
  rentalRate?: number;
  
  // Additional fields
  agentNotes?: string;
  
  // Owner information
  owner?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    isPrimaryContact: boolean;
  }
}

export interface PropertyImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
  isCover: boolean;
  previewUrl?: string;
  uploadStatus?: 'uploading' | 'success' | 'error';
}

export interface PropertyDocument {
  id: string;
  file?: File;
  name: string;
  documentType: string;
  url: string;
  uploadStatus?: 'uploading' | 'success' | 'error';
}

export interface PropertyFormState {
  currentStep: number;
  formData: PropertyFormData;
  images: PropertyImage[];
  documents: PropertyDocument[];
  isDirty: boolean;
  isSubmitting: boolean;
  lastSaved: Date | null;
}

export interface PropertyFormContextType {
  state: PropertyFormState;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  updatePropertyType: (type: 'Residential' | 'Commercial' | 'Industrial' | 'Land') => void;
  updateTransactionType: (type: 'Sale' | 'Rent') => void;
  addImage: (image: PropertyImage) => void;
  removeImage: (index: number) => void;
  setCoverImage: (index: number) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
  updateImageStatus: (index: number, status: 'uploading' | 'success' | 'error', url?: string) => void;
  addDocument: (document: PropertyDocument) => void;
  removeDocument: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
}
