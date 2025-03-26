
import { TransactionFormState } from './types';

// Get default commission rate based on transaction type
export const getDefaultCommissionRate = (type: string): number => {
  switch (type) {
    case 'Sale':
      return 2;
    case 'Rent':
      return 1;
    case 'Developer':
      return 3;
    default:
      return 2;
  }
};

// Initial state for the transaction form
export const initialTransactionFormState: TransactionFormState = {
  formData: {
    transactionType: 'Sale',
    transactionDate: new Date().toISOString(),
    propertyId: '',
    status: 'Draft',
    transactionValue: 0,
    commissionRate: getDefaultCommissionRate('Sale'),
    commissionAmount: 0,
    agentTier: 'Advisor',
    coBroking: {
      enabled: false,
      commissionSplit: 50
    }
  },
  documents: [],
  errors: {},
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null
};
