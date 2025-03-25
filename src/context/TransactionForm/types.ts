
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
  initiateApprovalProcess?: () => Promise<void>;
  checkApprovalStatus?: () => Promise<ApprovalStatus>;
}

// Define approval status type
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

// Define commission tier interface
export interface CommissionTier {
  id: string;
  name: string;
  rank: AgentRank;
  agentPercentage: number;
  minTransactions?: number;
  minSalesVolume?: number;
  isDefault?: boolean;
  thresholdAmount?: number;
}

// Define agent commission profile
export interface AgentCommissionProfile {
  agentId: string;
  agentRank: AgentRank;
  tier: CommissionTier;
  overridePercentage: number;
  effectiveDate: Date;
  endDate?: Date;
}

// Define commission approval interface
export interface CommissionApproval {
  id: string;
  transactionId: string;
  commissionAmount: number;
  status: ApprovalStatus;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  thresholdExceeded: boolean;
}

// Define commission approval comment
export interface CommissionApprovalComment {
  id: string;
  approvalId: string;
  comment: string;
  createdBy: string;
  createdAt: Date;
}

// Define commission override distribution
export interface CommissionOverride {
  transactionId: string;
  overrideAgentId: string;
  baseAgentId: string;
  amount: number;
  percentage: number;
  rank: AgentRank;
  status: 'Pending' | 'Approved' | 'Paid';
}
