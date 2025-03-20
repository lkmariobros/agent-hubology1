
import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { PropertyFormState, PropertyFormContextType, PropertyFormData, PropertyImage, PropertyDocument } from '../types/property-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Initial state based on property type
const getInitialPropertyData = (propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land'): PropertyFormData => {
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
const initialState: PropertyFormState = {
  formData: getInitialPropertyData('Residential'),
  images: [],
  documents: [],
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null,
};

// Action types
type ActionType =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PropertyFormData> }
  | { type: 'UPDATE_PROPERTY_TYPE'; payload: 'Residential' | 'Commercial' | 'Industrial' | 'Land' }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: 'Sale' | 'Rent' }
  | { type: 'ADD_IMAGE'; payload: PropertyImage }
  | { type: 'REMOVE_IMAGE'; payload: number }
  | { type: 'SET_COVER_IMAGE'; payload: number }
  | { type: 'REORDER_IMAGES'; payload: { startIndex: number; endIndex: number } }
  | { type: 'ADD_DOCUMENT'; payload: PropertyDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'SUBMITTING'; payload: boolean };

// Reducer function
const reducer = (state: PropertyFormState, action: ActionType): PropertyFormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isDirty: true,
      };
    case 'UPDATE_PROPERTY_TYPE':
      return {
        ...state,
        formData: getInitialPropertyData(action.payload),
        isDirty: true,
      };
    case 'UPDATE_TRANSACTION_TYPE': {
      const isRent = action.payload === 'Rent';
      return {
        ...state,
        formData: {
          ...state.formData,
          transactionType: action.payload,
          // Reset the price fields based on transaction type
          price: isRent ? null : state.formData.price,
          rentalRate: isRent ? (state.formData.rentalRate || 0) : null,
        },
        isDirty: true,
      };
    }
    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, action.payload],
        isDirty: true,
      };
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter((_, index) => index !== action.payload),
        isDirty: true,
      };
    case 'SET_COVER_IMAGE':
      return {
        ...state,
        images: state.images.map((image, index) => ({
          ...image,
          isCover: index === action.payload,
        })),
        isDirty: true,
      };
    case 'REORDER_IMAGES': {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.images);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        ...state,
        images: result.map((image, index) => ({
          ...image,
          displayOrder: index,
        })),
        isDirty: true,
      };
    }
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        isDirty: true,
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((_, index) => index !== action.payload),
        isDirty: true,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        formData: getInitialPropertyData(state.formData.propertyType),
      };
    case 'FORM_SAVED':
      return {
        ...state,
        lastSaved: action.payload,
        isDirty: false,
      };
    case 'SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    default:
      return state;
  }
};

// Create context
export const PropertyFormContext = createContext<PropertyFormContextType | undefined>(undefined);

// Provider component
export const PropertyFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-save functionality
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    
    if (state.isDirty) {
      saveTimer = setTimeout(() => {
        saveForm();
      }, 120000); // Auto-save every 2 minutes if form is dirty
    }
    
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [state.isDirty, state.formData]);

  // Update form data
  const updateFormData = useCallback((data: Partial<PropertyFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  // Update property type
  const updatePropertyType = useCallback((type: 'Residential' | 'Commercial' | 'Industrial' | 'Land') => {
    dispatch({ type: 'UPDATE_PROPERTY_TYPE', payload: type });
  }, []);

  // Update transaction type
  const updateTransactionType = useCallback((type: 'Sale' | 'Rent') => {
    dispatch({ type: 'UPDATE_TRANSACTION_TYPE', payload: type });
  }, []);

  // Image management functions
  const addImage = useCallback((image: PropertyImage) => {
    dispatch({ type: 'ADD_IMAGE', payload: image });
  }, []);

  const removeImage = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: index });
  }, []);

  const setCoverImage = useCallback((index: number) => {
    dispatch({ type: 'SET_COVER_IMAGE', payload: index });
  }, []);

  const reorderImages = useCallback((startIndex: number, endIndex: number) => {
    dispatch({ type: 'REORDER_IMAGES', payload: { startIndex, endIndex } });
  }, []);

  // Document management functions
  const addDocument = useCallback((document: PropertyDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  }, []);

  const removeDocument = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: index });
  }, []);

  // Navigation functions
  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Save form as draft
  const saveForm = useCallback(async () => {
    try {
      // In a real implementation, this would save to local storage 
      // or to Supabase as a draft property
      console.log('Saving form data:', state.formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'FORM_SAVED', payload: new Date() });
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving form:', error);
      return Promise.reject(error);
    }
  }, [state.formData]);

  // Submit form
  const submitForm = useCallback(async () => {
    dispatch({ type: 'SUBMITTING', payload: true });
    
    try {
      // 1. Upload images to Supabase Storage
      const uploadedImages = await Promise.all(
        state.images.map(async (image, index) => {
          if (image.file) {
            const fileExt = image.file.name.split('.').pop();
            const fileName = `${Date.now()}-${index}.${fileExt}`;
            const filePath = `properties/${fileName}`;
            
            const { data, error } = await supabase.storage
              .from('property-assets')
              .upload(filePath, image.file);
              
            if (error) throw error;
            
            return {
              ...image,
              url: filePath,
              displayOrder: index,
            };
          }
          return image;
        })
      );
      
      // 2. Upload documents to Supabase Storage
      const uploadedDocuments = await Promise.all(
        state.documents.map(async (document, index) => {
          if (document.file) {
            const fileExt = document.file.name.split('.').pop();
            const fileName = `${Date.now()}-${index}.${fileExt}`;
            const filePath = `documents/${fileName}`;
            
            const { data, error } = await supabase.storage
              .from('property-assets')
              .upload(filePath, document.file);
              
            if (error) throw error;
            
            return {
              ...document,
              url: filePath,
            };
          }
          return document;
        })
      );
      
      // 3. Get reference data IDs
      // Fetch property type ID
      const { data: propertyTypeData } = await supabase
        .from('property_types')
        .select('id')
        .eq('name', state.formData.propertyType)
        .single();
        
      // Fetch transaction type ID
      const { data: transactionTypeData } = await supabase
        .from('transaction_types')
        .select('id')
        .eq('name', state.formData.transactionType)
        .single();
        
      // Fetch status ID
      const { data: statusData } = await supabase
        .from('property_statuses')
        .select('id')
        .eq('name', state.formData.status)
        .single();
      
      // 4. Build property data object based on property type
      // Extract common fields
      const commonPropertyData = {
        title: state.formData.title,
        property_type_id: propertyTypeData?.id,
        transaction_type_id: transactionTypeData?.id,
        status_id: statusData?.id,
        description: state.formData.description,
        price: state.formData.transactionType === 'Sale' ? state.formData.price : null,
        rental_rate: state.formData.transactionType === 'Rent' ? state.formData.rentalRate : null,
        featured: state.formData.featured,
        street: state.formData.address.street,
        city: state.formData.address.city,
        state: state.formData.address.state,
        zip: state.formData.address.zip,
        country: state.formData.address.country,
        agent_notes: state.formData.agentNotes,
      };
      
      // Add type-specific fields
      let typeSpecificData = {};
      
      switch (state.formData.propertyType) {
        case 'Residential':
          typeSpecificData = {
            bedrooms: state.formData.bedrooms,
            bathrooms: state.formData.bathrooms,
            built_up_area: state.formData.builtUpArea,
            furnishing_status: state.formData.furnishingStatus,
          };
          break;
        case 'Commercial':
          typeSpecificData = {
            floor_area: state.formData.floorArea,
            zoning_type: state.formData.zoningType,
            building_class: state.formData.buildingClass,
          };
          break;
        case 'Industrial':
          typeSpecificData = {
            land_area: state.formData.landArea,
            ceiling_height: state.formData.ceilingHeight,
            loading_bays: state.formData.loadingBays,
            power_capacity: state.formData.powerCapacity,
          };
          break;
        case 'Land':
          typeSpecificData = {
            land_size: state.formData.landSize,
            zoning: state.formData.zoning,
            road_frontage: state.formData.roadFrontage,
            topography: state.formData.topography,
          };
          break;
      }
      
      // Combine common and type-specific data
      const propertyData = {
        ...commonPropertyData,
        ...typeSpecificData,
      };
      
      // 5. Insert property into database
      const { data: propertyResult, error: propertyError } = await supabase
        .from('enhanced_properties')
        .insert(propertyData)
        .select()
        .single();
        
      if (propertyError) throw propertyError;
      
      // 6. Insert images
      if (uploadedImages.length > 0) {
        const imagesToInsert = uploadedImages.map((image) => ({
          property_id: propertyResult.id,
          storage_path: image.url,
          display_order: image.displayOrder,
          is_cover: image.isCover,
        }));
        
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imagesToInsert);
          
        if (imagesError) throw imagesError;
      }
      
      // 7. Insert documents
      if (uploadedDocuments.length > 0) {
        const documentsToInsert = uploadedDocuments.map((doc) => ({
          property_id: propertyResult.id,
          name: doc.name,
          storage_path: doc.url,
          document_type: doc.documentType,
        }));
        
        const { error: documentsError } = await supabase
          .from('property_documents')
          .insert(documentsToInsert);
          
        if (documentsError) throw documentsError;
      }
      
      dispatch({ type: 'SUBMITTING', payload: false });
      toast.success('Property listing created successfully!');
      resetForm();
      return Promise.resolve(propertyResult.id);
    } catch (error) {
      console.error('Error submitting property:', error);
      dispatch({ type: 'SUBMITTING', payload: false });
      toast.error('Failed to create property listing. Please try again.');
      return Promise.reject(error);
    }
  }, [state, resetForm]);

  const contextValue: PropertyFormContextType = {
    state,
    updateFormData,
    updatePropertyType,
    updateTransactionType,
    addImage,
    removeImage,
    setCoverImage,
    reorderImages,
    addDocument,
    removeDocument,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    saveForm,
    submitForm,
  };

  return (
    <PropertyFormContext.Provider value={contextValue}>
      {children}
    </PropertyFormContext.Provider>
  );
};

// Custom hook to use the PropertyForm context
export const usePropertyForm = (): PropertyFormContextType => {
  const context = useContext(PropertyFormContext);
  if (context === undefined) {
    throw new Error('usePropertyForm must be used within a PropertyFormProvider');
  }
  return context;
};
