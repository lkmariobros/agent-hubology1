
import { PaymentSchedule } from '@/types/commission';

// Transaction form types
export interface TransactionFormData {
  id?: string;
  transactionType: TransactionType;
  transactionDate: string; // Changed from Date to string
  closingDate?: string; // Changed from Date to string
  propertyId: string;
  status: TransactionStatus;
  property?: PropertyInfo;
  buyer?: ClientInfo;
  seller?: ClientInfo;
  landlord?: ClientInfo;
  tenant?: ClientInfo;
  developer?: DeveloperInfo;
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  agentTier?: AgentRank; // Updated to AgentRank type
  coBroking?: CoBrokingInfo;
  notes?: string;
  agentId?: string;
  paymentScheduleId?: string;
}

export interface PropertyInfo {
  id: string;
  title: string;
  address?: string;
  type?: string;
  price?: number;
  rentalRate?: number;
}

export interface ClientInfo {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface DeveloperInfo {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface CoBrokingInfo {
  enabled: boolean;
  agentName?: string;
  agentCompany?: string;
  agentContact?: string;
  commissionSplit: number;
  credentialsVerified?: boolean;
}

export type TransactionType = 'Sale' | 'Rent' | 'Developer';
export type TransactionStatus = 'Draft' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type AgentRank = 'Associate' | 'Senior Associate' | 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Director' | 'Supreme Leader';
export type DocumentType = 'Contract' | 'Agreement' | 'Invoice' | 'Receipt' | 'Other';

export interface TransactionDocument {
  id?: string;
  name: string;
  documentType: DocumentType;
  file?: File;
  url?: string;
}

export interface CommissionBreakdown {
  totalCommission: number;
  agencyShare: number;
  agentShare: number;
  ourAgencyCommission?: number;
  coAgencyCommission?: number;
  agentTier?: AgentRank;
  agentCommissionPercentage?: number;
  // These are used for display purposes in CommissionBreakdownCard
  transactionValue?: number;
  commissionRate?: number;
}

export interface TransactionFormState {
  formData: TransactionFormData;
  documents: TransactionDocument[];
  errors: Record<string, string>;
  // Additional state properties
  currentStep: number;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  paymentScheduleId?: string;
}

export type TransactionFormAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<TransactionFormData> }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<TransactionFormData> }
  | { type: 'UPDATE_TRANSACTION_TYPE'; payload: TransactionType }
  | { type: 'ADD_DOCUMENT'; payload: TransactionDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: number }
  | { type: 'UPDATE_DOCUMENT'; payload: TransactionDocument }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'FORM_SAVED'; payload: Date }
  | { type: 'SUBMITTING'; payload: boolean }
  | { type: 'SET_PAYMENT_SCHEDULE'; payload: string };

export interface TransactionFormContextType {
  state: TransactionFormState;
  dispatch: React.Dispatch<TransactionFormAction>;
  updateFormData: (data: Partial<TransactionFormData>) => void;
  updateTransactionType: (type: TransactionType) => void;
  addDocument: (document: TransactionDocument) => void;
  removeDocument: (index: number) => void;
  updateDocument: (document: TransactionDocument) => void;
  deleteDocument: (documentId: string) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  calculateCommission: () => CommissionBreakdown;
  selectPaymentSchedule: (scheduleId: string) => void;
  validateCurrentStep: () => boolean;
  saveForm: () => Promise<void>;
}
