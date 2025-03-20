
import { TransactionFormData, TransactionFormState, TransactionType } from "./types";

// Initial transaction data based on transaction type
export const getInitialTransactionData = (transactionType: TransactionType): TransactionFormData => {
  const commonData = {
    transactionType: transactionType,
    status: 'Draft' as const,
    transactionDate: new Date(),
    transactionValue: 0,
    commissionRate: getDefaultCommissionRate(transactionType),
    commissionAmount: 0,
    notes: '',
    coBroking: {
      enabled: false,
      agentName: '',
      agentCompany: '',
      agentContact: '',
      commissionSplit: 50,
      credentialsVerified: false,
    },
  };

  switch (transactionType) {
    case 'Sale':
      return {
        ...commonData,
        buyer: {
          name: '',
          email: '',
          phone: '',
        },
        seller: {
          name: '',
          email: '',
          phone: '',
        },
      };
    case 'Rent':
      return {
        ...commonData,
        landlord: {
          name: '',
          email: '',
          phone: '',
        },
        tenant: {
          name: '',
          email: '',
          phone: '',
        },
      };
    case 'Primary':
      return {
        ...commonData,
        buyer: {
          name: '',
          email: '',
          phone: '',
        },
        developer: {
          name: '',
          email: '',
          phone: '',
        },
      };
    default:
      return commonData as TransactionFormData;
  }
};

// Get default commission rate based on transaction type
export const getDefaultCommissionRate = (transactionType: TransactionType): number => {
  switch (transactionType) {
    case 'Sale':
      return 2; // 2% for sales
    case 'Rent':
      return 1; // 1% for rentals
    case 'Primary':
      return 3; // 3% for primary project sales
    default:
      return 2;
  }
};

// Initial state
export const initialTransactionFormState: TransactionFormState = {
  formData: getInitialTransactionData('Sale'),
  documents: [],
  currentStep: 0,
  isSubmitting: false,
  isDirty: false,
  lastSaved: null,
  errors: {},
};
