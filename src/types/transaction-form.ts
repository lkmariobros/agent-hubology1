
export interface TransactionFormValues {
  transactionType: string;
  transactionInformation: {
    transactionDate: Date | string;
    spaDate?: Date | string;
    price: number;
    address: string;
    propertyType: string;
  };
  clientInformation: {
    name: string;
    email: string;
    phone: string;
    idNumber?: string;
  };
  sellerInformation?: {
    name: string;
    email: string;
    phone: string;
    idNumber?: string;
  };
  agentDetails: {
    agentId: string;
    commissionRate: number;
    commissionAmount: number;
    commissionSplit: boolean;
    coAgentId?: string;
    coAgentCommissionPercentage?: number;
  };
  documents: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
  additionalNotes?: string;
}

export interface TransactionStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface CommissionCalculatorData {
  transactionValue: number;
  commissionRate: number;
  agentTier: number;
  commissionSplit: boolean;
  coAgentPercentage?: number;
}

export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: string;
  submitted_by: string;
  reviewer_id?: string;
  reviewed_at?: string;
  threshold_exceeded: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  property_transactions: {
    transaction_value: number;
    commission_amount: number;
    transaction_date: string;
    property_id: string;
    commission_rate: number;
    agent_id: string;
    notes?: string;
    property?: {
      id: string;
      title: string;
    };
  };
  agent?: {
    id: string;
    name: string;
  };
}

export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  content: string;
  created_by: string;
  created_at: string;
  user?: {
    name: string;
  };
}

export interface CommissionApprovalStats {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  pendingValue: number;
  approvedValue: number;
  paidValue: number;
}

// Adding the missing types
export type TransactionType = 'Sale' | 'Rent' | 'Primary';

export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export type DocumentType = 'Contract' | 'Agreement' | 'Invoice' | 'Receipt' | 'Other';

export interface TransactionDocument {
  id?: string;
  name: string;
  documentType: DocumentType;
  file?: File;
  path?: string;
}

export interface TransactionFormData {
  transactionValue: number;
  transactionType: TransactionType;
  transactionDate: Date | string;
  propertyDetails: {
    propertyId?: string;
    address: string;
    propertyType: string;
  };
  clientDetails: {
    name: string;
    email: string;
    phone: string;
  };
  commissionRate: number;
  commissionAmount: number;
  agentTier: AgentRank;
  coBroking?: CoBrokingInfo;
  documents: TransactionDocument[];
  notes?: string;
}

export interface CoBrokingInfo {
  enabled: boolean;
  agentName: string;
  agentCompany: string;
  agentContact: string;
  commissionSplit: number;
  credentialsVerified: boolean;
}

export interface TransactionFormState {
  step: number;
  formData: TransactionFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isLoading: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface CommissionBreakdown {
  totalCommission: number;
  agentCommission: number;
  agencyCommission: number;
  agentCommissionPercentage: number;
  hasOverrides: boolean;
  overrides?: {
    agentId: string;
    agentName: string;
    rank: string;
    amount: number;
    percentage: number;
  }[];
  coBrokingCommission?: {
    amount: number;
    percentage: number;
  };
}
