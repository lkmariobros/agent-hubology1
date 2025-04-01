
import { TransactionFormState, TransactionFormAction } from './types';
import { initialTransactionFormState } from './initialState';

// Reducer function
export const transactionFormReducer = (
  state: TransactionFormState,
  action: TransactionFormAction
): TransactionFormState => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: true
      };
      
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: true
      };
      
    case 'UPDATE_TRANSACTION_TYPE':
      return {
        ...state,
        formData: {
          ...state.formData,
          transactionType: action.payload
        },
        isDirty: true
      };
      
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        isDirty: true
      };
      
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((_, index) => index !== action.payload),
        isDirty: true
      };
      
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
        isDirty: true
      };
      
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        isDirty: true
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message
        }
      };
      
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors
      };
      
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      };
      
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6) // 6 is the max step index
      };
      
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      };
      
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.min(Math.max(action.payload, 0), 6)
      };
      
    case 'RESET_FORM':
      return initialTransactionFormState;
      
    case 'FORM_SAVED':
      return {
        ...state,
        lastSaved: action.payload,
        isDirty: false
      };
      
    case 'SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
      
    case 'SET_PAYMENT_SCHEDULE':
      return {
        ...state,
        paymentScheduleId: action.payload,
        formData: {
          ...state.formData,
          paymentScheduleId: action.payload
        },
        isDirty: true
      };
      
    default:
      return state;
  }
};
