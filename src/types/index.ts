export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  status?: string; 
  period?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype?: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  status: string;
  agent?: Agent;
  createdAt: string;
  updatedAt: string;
  size?: number;
  stock?: PropertyStock;
  transactionType?: string;
  featured?: boolean;
  listedBy?: string;
}

export interface PropertyStock {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}

export interface Agent {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  agentId: string;
  price: number;
  commission: number;
  status: string;
  date: string;
  notes: string;
  closingDate?: string;
  property?: {
    title: string;
    address: {
      city: string;
      state: string;
    };
  };
  agent?: {
    id: string;
    name: string;
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
  documents?: TransactionDocument[];
  commissionRate?: number;
}

export interface TransactionDocument {
  id?: string;
  name: string;
  documentType: DocumentType;
  url?: string;
  file?: File;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  budget: string;
  location: string;
  status: string;
  postedBy: string;
  postedDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CommissionTier {
  id: string;
  name: string;
  rank: AgentRank;
  agentPercentage: number;
  minTransactions?: number;
  minSalesVolume?: number;
  isDefault?: boolean;
  thresholdAmount?: number;
  tier?: string;
  rate?: number;
  color?: string;
}

export interface AgentCommissionProfile {
  agentId: string;
  agentRank: AgentRank;
  tier: CommissionTier;
  overridePercentage: number;
  effectiveDate: Date;
  endDate?: Date;
}

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

export interface CommissionApprovalComment {
  id: string;
  approvalId: string;
  comment: string;
  createdBy: string;
  createdAt: Date;
}

export interface CommissionOverride {
  transactionId: string;
  overrideAgentId: string;
  baseAgentId: string;
  amount: number;
  percentage: number;
  rank: AgentRank;
  status: 'Pending' | 'Approved' | 'Paid';
}

// Combined OverrideCommission interface 
export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  amount: number;
  percentage: number;
  status: 'Pending' | 'Approved' | 'Paid';
  agentName?: string;
  rank?: AgentRank;
}

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rank: string;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  downline: AgentWithHierarchy[];
  upline?: AgentWithHierarchy;
}

export interface CommissionHistory {
  id: string;
  transactionId?: string;
  property: {
    title: string;
    location: string;
  };
  date: string;
  amount: number;
  type: 'personal' | 'override';
  source?: string;
  transactionReference?: string;
}

export type TransactionFormData = {
  id?: string;
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  transactionDate: string;
  closingDate: string;
  propertyId: string;
  agentId: string;
  status: string;
  notes: string;
  buyer?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  seller?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  property?: any;
  transactionType?: TransactionType;
  agentTier?: AgentRank;
  landlord?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  tenant?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  developer?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  coBroking?: {
    enabled: boolean;
    agentName?: string;
    agentCompany?: string;
    agentContact?: string;
    commissionSplit: number;
    credentialsVerified?: boolean;
  };
};

export type PropertyFormValues = TransactionFormData;

export type DocumentType = 'Contract' | 'Agreement' | 'Invoice' | 'Receipt' | 'Other';

export type AgentRank = 'Associate' | 'Senior Associate' | 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Director' | 'Supreme Leader';
export type TransactionType = 'Sale' | 'Rent' | 'Developer';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review' | 'Ready for Payment' | 'Paid';

// Adding missing User type
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  tier?: string;
  rank?: AgentRank;
  status?: 'active' | 'inactive';
  joinDate?: string;
  salesVolume?: number;
  transactions?: number;
  commission?: number;
}

// Adding missing RankRequirement type
export interface RankRequirement {
  id: string;
  rank: AgentRank;
  minSalesVolume: number;
  minTransactions: number;
  commissionPercentage: number;
  color: string;
}

// Fix for PropertyFormValues - ensure it's not using TransactionFormData fields
export type PropertyFormValues = {
  title: string;
  description: string;
  price: number;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype?: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  transactionType?: string;
};
