
import { PropertyFormState, PropertyFormData, PropertyImage, PropertyDocument } from '../../types/property-form';
import { initialPropertyFormState } from './initialState';

type PropertyFormAction =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PropertyFormData> }
  | { type: 'UPDATE_PROPERTY_TYPE'; payload: 'Residential' | 'Commercial' | 'Industrial' | 'Land' }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: 'Sale' | 'Rent' }
  | { type: 'ADD_IMAGE'; payload: PropertyImage }
  | { type: 'REMOVE_IMAGE'; payload: number }
  | { type: 'SET_COVER_IMAGE'; payload: number }
  | { type: 'REORDER_IMAGES'; payload: { startIndex: number; endIndex: number } }
  | { type: 'UPDATE_IMAGE_STATUS'; payload: { index: number; status: 'uploading' | 'success' | 'error'; url?: string } }
  | { type: 'ADD_DOCUMENT'; payload: PropertyDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'RESET_FORM' }
  | { type: 'SUBMITTING'; payload: boolean };

export const propertyFormReducer = (
  state: PropertyFormState,
  action: PropertyFormAction
): PropertyFormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
        isDirty: true,
      };

    case 'UPDATE_PROPERTY_TYPE':
      return {
        ...state,
        formData: {
          ...state.formData,
          propertyType: action.payload,
        },
        isDirty: true,
      };

    case 'UPDATE_TRANSACTION_TYPE':
      return {
        ...state,
        formData: {
          ...state.formData,
          transactionType: action.payload,
        },
        isDirty: true,
      };

    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, action.payload],
        isDirty: true,
      };

    case 'REMOVE_IMAGE':
      const newImages = [...state.images];
      newImages.splice(action.payload, 1);

      // If we removed the cover image, set the first image as cover (if any)
      const updatedImages = newImages.map((image, index) => ({
        ...image,
        isCover: state.images[action.payload].isCover && index === 0 ? true : image.isCover,
      }));

      return {
        ...state,
        images: updatedImages,
        isDirty: true,
      };

    case 'SET_COVER_IMAGE':
      const imagesWithNewCover = state.images.map((image, index) => ({
        ...image,
        isCover: index === action.payload,
      }));

      return {
        ...state,
        images: imagesWithNewCover,
        isDirty: true,
      };

    case 'REORDER_IMAGES':
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.images);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      // Update display order
      const reorderedImages = result.map((image, index) => ({
        ...image,
        displayOrder: index,
      }));

      return {
        ...state,
        images: reorderedImages,
        isDirty: true,
      };
      
    case 'UPDATE_IMAGE_STATUS':
      const { index, status, url } = action.payload;
      const updatedImagesWithStatus = [...state.images];
      
      if (index >= 0 && index < updatedImagesWithStatus.length) {
        updatedImagesWithStatus[index] = {
          ...updatedImagesWithStatus[index],
          uploadStatus: status,
          url: url || updatedImagesWithStatus[index].url,
        };
      }
      
      return {
        ...state,
        images: updatedImagesWithStatus,
        isDirty: true,
      };

    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        isDirty: true,
      };

    case 'REMOVE_DOCUMENT':
      const newDocuments = [...state.documents];
      newDocuments.splice(action.payload, 1);
      return {
        ...state,
        documents: newDocuments,
        isDirty: true,
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6), // Assuming 7 steps (0-6)
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, 6)), // Clamp between 0 and 6
      };

    case 'FORM_SAVED':
      return {
        ...state,
        lastSaved: action.payload,
        isDirty: false,
      };

    case 'RESET_FORM':
      return initialPropertyFormState;

    case 'SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    default:
      return state;
  }
};
