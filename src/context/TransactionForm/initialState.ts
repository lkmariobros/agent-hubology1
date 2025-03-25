
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
    propertyId: '', // Add default empty propertyId
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
          notes: '',
        },
        seller: {
          name: '',
          email: '',
          phone: '',
          notes: '',
        },
      };
    case 'Rent':
      return {
        ...commonData,
        landlord: {
          name: '',
          email: '',
          phone: '',
          notes: '',
        },
        tenant: {
          name: '',
          email: '',
          phone: '',
          notes: '',
        },
        // For rentals, we initialize with the default values appropriate for rentals
        commissionRate: 0, // Not used for rentals
        commissionAmount: 0, // Will be set to match the owner's commission input
      };
    case 'Developer':
      return {
        ...commonData,
        buyer: {
          name: '',
          email: '',
          phone: '',
          notes: '',
        },
        developer: {
          name: '',
          email: '',
          phone: '',
          notes: '',
        },
      };
    default:
      return {
        ...commonData,
        propertyId: '',
      } as TransactionFormData;
  }
};

// Get default commission rate based on transaction type
export const getDefaultCommissionRate = (transactionType: TransactionType): number => {
  switch (transactionType) {
    case 'Sale':
      return 2; // 2% for sales
    case 'Rent':
      return 0; // Not applicable for rentals (we use direct commission amount)
    case 'Developer':
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
