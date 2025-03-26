
import { TransactionFormState } from './types';
import { initialTransactionFormState } from './initialState';

// Action types
type ActionType = 
  | { type: 'UPDATE_FORM_DATA'; payload: any }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: any }
  | { type: 'ADD_DOCUMENT'; payload: any }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'SUBMITTING'; payload: boolean };

// Reducer function
export const transactionFormReducer = (
  state: TransactionFormState,
  action: ActionType
): TransactionFormState => {
  switch (action.type) {
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
      
    default:
      return state;
  }
};
