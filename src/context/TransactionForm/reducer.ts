import { TransactionFormState } from './types';
import { stringToTransactionType } from '@/utils/typeConversions';

type TransactionFormAction =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<TransactionFormState['formData']> }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: string }
  | { type: 'ADD_DOCUMENT'; payload: any }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> };

export const transactionFormReducer = (
  state: TransactionFormState,
  action: TransactionFormAction
): TransactionFormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isDirty: true
      };
    case 'UPDATE_TRANSACTION_TYPE':
      return {
        ...state,
        formData: {
          ...state.formData,
          transactionType: stringToTransactionType(action.payload),
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
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6)
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'RESET_FORM':
      return {
        ...state,
        formData: {
          transactionType: 'Sale',
          transactionDate: new Date().toISOString().split('T')[0],
          propertyId: '',
          status: 'Draft',
          transactionValue: 0,
          commissionRate: 0,
          commissionAmount: 0,
          agentTier: 'Advisor'
        },
        documents: [],
        errors: {},
        currentStep: 0,
        isSubmitting: false,
        isDirty: false,
        lastSaved: null
      };
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
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      };
    default:
      return state;
  }
};
