
import { 
  TransactionFormState,
  TransactionFormData,
  TransactionDocument, 
  CommissionBreakdown,
  TransactionType,
  AgentRank
} from '../../types/transaction-form';

// Re-export types from the main types file
export type {
  TransactionFormState,
  TransactionFormData,
  TransactionDocument,
  CommissionBreakdown,
  TransactionType,
  AgentRank
};

// Define the context type
export interface TransactionFormContextType {
  state: TransactionFormState;
  updateFormData: (data: Partial<TransactionFormData>) => void;
  updateTransactionType: (type: TransactionType) => void;
  addDocument: (document: TransactionDocument) => void;
  removeDocument: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  calculateCommission: () => CommissionBreakdown;
  validateCurrentStep: () => boolean;
}
