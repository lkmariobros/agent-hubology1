
// Transaction form types
export interface TransactionFormData {
  id?: string;
  transactionType: TransactionType;
  transactionDate: Date;
  closingDate?: Date;
  propertyId: string;
  status: TransactionStatus;
  property?: {
    id: string;
    title: string;
    address?: string;
    type?: string;
  };
  buyer?: {
    name: string;
    email?: string;
    phone?: string;
  };
  seller?: {
    name: string;
    email?: string;
    phone?: string;
  };
  landlord?: {
    name: string;
    email?: string;
    phone?: string;
  };
  tenant?: {
    name: string;
    email?: string;
    phone?: string;
  };
  developer?: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
  };
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  agentTier?: AgentRank;
  coBroking?: {
    enabled: boolean;
    agentName?: string;
    agentCompany?: string;
    agentContact?: string;
    commissionSplit: number;
  };
  notes?: string;
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
}

export interface TransactionFormState {
  step: number;
  formData: TransactionFormData;
  documents: TransactionDocument[];
  errors: Record<string, string>;
}
