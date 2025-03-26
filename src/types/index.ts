export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
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
  id: string;
  name: string;
  documentType: string;
  url: string;
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
  postedDate: string;  // This should match what's used in components
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
}

export interface CommissionHistory {
  id: string;
  transactionId: string;
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
  };
  seller?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export type TransactionType = 'Sale' | 'Rental';
export type AgentRank = 'Associate' | 'Senior Associate' | 'Team Leader' | 'Sales Leader' | 'Director';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
