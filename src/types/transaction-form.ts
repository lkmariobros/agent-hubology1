
import { AgentRank } from '@/types';

// Transaction Type
export type TransactionType = 'Sale' | 'Rent' | 'Developer';

// Client details interfaces
export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

// Co-broking information
export interface CoBrokingInfo {
  enabled: boolean;
  agentName: string;
  agentCompany: string;
  agentContact: string;
  commissionSplit: number;
  credentialsVerified: boolean;
}

// Property details interface
export interface PropertyDetails {
  title: string;
  address: string;
  type: string;
  price: number;
}

// Document type
export type DocumentType = 'Contract' | 'SPA' | 'Receipt' | 'ID' | 'Other';

// Document interface
export interface TransactionDocument {
  id?: string;
  name: string;
  documentType: DocumentType;
  file?: File;
  url?: string;
}

// Transaction form data
export interface TransactionFormData {
  id?: string;
  transactionType: TransactionType;
  transactionDate: Date;
  closingDate?: Date;
  status?: string;
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  notes: string;
  propertyId: string;
  property?: PropertyDetails;
  coBroking: CoBrokingInfo;
  // Client information based on transaction type
  buyer?: ClientDetails;
  seller?: ClientDetails;
  landlord?: ClientDetails;
  tenant?: ClientDetails;
  developer?: ClientDetails;
  agentTier?: AgentRank;
}

// Transaction form state
export interface TransactionFormState {
  formData: TransactionFormData;
  documents: TransactionDocument[];
  currentStep: number;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  errors: Record<string, string>;
}

// Commission breakdown interface
export interface CommissionBreakdown {
  totalCommission: number;
  agencyCommission: number;
  agentCommission: number;
  agentTier?: AgentRank;
  agentCommissionPercentage?: number;
  personalCommission?: number;
  overrideCommission?: number;
  agentShare?: number;
  agencyShare?: number;
  transactionValue?: number;
  commissionRate?: number;
  ourAgencyCommission?: number;
  coAgencyCommission?: number;
}

// For form compatibility with React Hook Form
export interface TransactionFormValues {
  transactionType?: string;
  transactionInformation?: {
    transactionDate?: string | Date;
    spaDate?: string | Date;
    price?: number;
    address?: string;
    propertyType?: string;
  };
  clientInformation?: {
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
  agentDetails?: {
    agentId?: string;
    commissionRate?: number;
    coAgent?: boolean;
    coAgentName?: string;
    coAgentCompany?: string;
    coAgentCommissionPercentage?: number;
  };
  additionalNotes?: string;
  documents?: { id: string; name: string; path: string; type: string }[];
}
