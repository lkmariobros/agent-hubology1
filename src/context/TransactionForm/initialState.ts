
import { TransactionFormState, TransactionFormData, TransactionType } from './types';

// Default commission rates by transaction type
const DEFAULT_COMMISSION_RATES = {
  'Sale': 2.75,    // 2.75% for property sales
  'Rent': 1.0,     // 1.0% for rentals (or flat fee)
  'Developer': 3.0 // 3.0% for developer projects
};

// Function to get default commission rate by transaction type
export const getDefaultCommissionRate = (type: TransactionType): number => {
  return DEFAULT_COMMISSION_RATES[type] || 2.75;
};

// Create initial form data based on transaction type
export const getInitialTransactionData = (transactionType: TransactionType): TransactionFormData => {
  const commissionRate = getDefaultCommissionRate(transactionType);
  
  return {
    transactionType,
    transactionDate: new Date(),
    propertyId: '',
    status: 'Draft',
    transactionValue: 0,
    commissionRate,
    commissionAmount: 0,
    coBroking: {
      enabled: false,
      commissionSplit: 50 // Default 50/50 split
    }
  };
};

// Initial state for the transaction form
export const initialTransactionFormState: TransactionFormState = {
  formData: getInitialTransactionData('Sale'),
  documents: [],
  errors: {},
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null
};
