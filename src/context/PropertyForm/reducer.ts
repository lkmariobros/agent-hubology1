
import { PropertyFormState, PropertyFormData, PropertyImage, PropertyDocument } from '../../types/property-form';
import { getInitialPropertyData } from './initialState';

// Action types
export type PropertyFormAction =
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
export const propertyFormReducer = (
  state: PropertyFormState, 
  action: PropertyFormAction
): PropertyFormState => {
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
        ...state,
        formData: getInitialPropertyData(state.formData.propertyType),
        images: [],
        documents: [],
        currentStep: 0,
        isSubmitting: false,
        isDirty: false,
        lastSaved: null,
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
