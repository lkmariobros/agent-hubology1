
import { 
  TransactionFormState, 
  TransactionFormData, 
  TransactionDocument, 
  TransactionType 
} from './types';
import { getInitialTransactionData } from './initialState';

// Action types
export type TransactionFormAction =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<TransactionFormData> }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: TransactionType }
  | { type: 'ADD_DOCUMENT'; payload: TransactionDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> };

// Reducer function
export const transactionFormReducer = (
  state: TransactionFormState, 
  action: TransactionFormAction
): TransactionFormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      // Handle coBroking field updates properly
      if (action.payload.coBroking) {
        // Make sure the coBroking object is initialized
        const currentCoBroking = state.formData.coBroking || {
          enabled: false,
          agentName: '',
          agentCompany: '',
          agentContact: '',
          commissionSplit: 50
        };
        
        return {
          ...state,
          formData: { 
            ...state.formData, 
            ...action.payload,
            coBroking: {
              ...currentCoBroking,
              ...action.payload.coBroking
            }
          },
          isDirty: true,
        };
      }
      
      // Handle other fields
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isDirty: true,
      };
      
    case 'UPDATE_TRANSACTION_TYPE': {
      // Keep current property data when changing transaction type
      const currentProperty = state.formData.property;
      const currentPropertyId = state.formData.propertyId;
      
      // Get fresh form data for the new transaction type
      const newFormData = getInitialTransactionData(action.payload);
      
      // Merge the new form data with existing property data
      return {
        ...state,
        formData: { 
          ...newFormData, 
          property: currentProperty,
          propertyId: currentPropertyId 
        },
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
        formData: getInitialTransactionData(state.formData.transactionType),
        documents: [],
        currentStep: 0,
        isSubmitting: false,
        isDirty: false,
        lastSaved: null,
        errors: {},
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
      
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
      
    default:
      return state;
  }
};
