import { AgentRank } from '@/types';
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
  | { type: 'ADD_DOCUMENT'; payload: TransactionDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: TransactionDocument }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_IS_DIRTY'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'RESET_FORM' }
  | { type: 'SET_PAYMENT_SCHEDULE', payload: string };

export interface TransactionFormContextType {
  state: TransactionFormState;
  dispatch: React.Dispatch<TransactionFormAction>;
  updateFormData: (data: Partial<TransactionFormData>) => void;
  addDocument: (document: TransactionDocument) => void;
  updateDocument: (document: TransactionDocument) => void;
  deleteDocument: (documentId: string) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  calculateCommission: () => CommissionBreakdown;
  selectPaymentSchedule: (scheduleId: string) => void;
}
