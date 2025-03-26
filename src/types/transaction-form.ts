
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
  agentTier?: string; // Changed from AgentRank to string for compatibility
  coBroking?: CoBrokingInfo;
  notes?: string;
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
export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';
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
}
