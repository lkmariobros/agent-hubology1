
import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { PropertyFormState, PropertyFormContextType, PropertyFormData, PropertyImage, PropertyDocument } from '../../types/property-form';
import { propertyFormReducer } from './reducer';
import { initialPropertyFormState } from './initialState';
import { saveFormAsDraft, submitPropertyForm } from './formSubmission';
import { toast } from 'sonner';

// Create context
export const PropertyFormContext = createContext<PropertyFormContextType | undefined>(undefined);

// Provider component
export const PropertyFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(propertyFormReducer, initialPropertyFormState);

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
  const updateTransactionType = useCallback((type: 'Sale' | 'Rent' | 'Primary') => {
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

  // New function to update image upload status
  const updateImageStatus = useCallback((index: number, status: 'uploading' | 'success' | 'error', url?: string) => {
    dispatch({ 
      type: 'UPDATE_IMAGE_STATUS', 
      payload: { index, status, url } 
    });
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
    // Check if there are any images currently uploading
    const hasUploadingImages = state.images.some(image => image.uploadStatus === 'uploading');
    
    if (hasUploadingImages) {
      toast.warning("Please wait for image uploads to complete before proceeding");
      return;
    }
    
    dispatch({ type: 'NEXT_STEP' });
  }, [state.images]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((step: number) => {
    // Check if navigating away from media step and if there are uploads in progress
    if (state.currentStep === 6 && step !== 6) {
      const hasUploadingImages = state.images.some(image => image.uploadStatus === 'uploading');
      
      if (hasUploadingImages) {
        toast.warning("Please wait for image uploads to complete before navigating away");
        return;
      }
    }
    
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, [state.currentStep, state.images]);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Save form as draft
  const saveForm = useCallback(async () => {
    try {
      await saveFormAsDraft(state);
      dispatch({ type: 'FORM_SAVED', payload: new Date() });
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving form:', error);
      return Promise.reject(error);
    }
  }, [state]);

  // Submit form
  const submitForm = useCallback(async () => {
    // Check if there are any images currently uploading
    const hasUploadingImages = state.images.some(image => image.uploadStatus === 'uploading');
    
    if (hasUploadingImages) {
      toast.error("Please wait for all image uploads to complete before submitting");
      return Promise.reject(new Error("Uploads in progress"));
    }
    
    dispatch({ type: 'SUBMITTING', payload: true });
    
    try {
      await submitPropertyForm(state);
      dispatch({ type: 'SUBMITTING', payload: false });
      resetForm();
      return Promise.resolve();
    } catch (error) {
      dispatch({ type: 'SUBMITTING', payload: false });
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
    updateImageStatus,
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
