
import { 
  TransactionFormData, 
  TransactionDocument, 
  CommissionBreakdown,
  TransactionType,
  AgentRank
} from '@/types/transaction-form';

export interface TransactionFormContextType {
  state: TransactionFormState;
  updateFormData: (data: Partial<TransactionFormData>) => void;
  updateTransactionType: (type: TransactionType) => void;
  addDocument: (document: TransactionDocument) => void;
  removeDocument: (index: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  calculateCommission: () => CommissionBreakdown;
  validateCurrentStep: () => boolean;
}

export interface TransactionFormState {
  formData: TransactionFormData;
  documents: TransactionDocument[];
  errors: Record<string, string>;
  currentStep: number;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
}
