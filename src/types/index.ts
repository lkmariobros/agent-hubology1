export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  status?: string; // Added to fix DashboardMetric errors
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

// Consolidated PropertyStock to avoid duplicate declarations
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
  id: string;
  name: string;
  documentType: string;
  url: string;
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
  postedDate: string;  // This should match what's used in components
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
  // Properties needed by CommissionTiers component
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

export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  amount: number;
  percentage: number;
  status: string;
  agentName?: string; // Add missing property
  rank?: string; // Add missing property
}

export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  amount: number;
  percentage: number;
  status: string;
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
  upline?: AgentWithHierarchy; // Added to fix useCommission errors
}

export interface CommissionHistory {
  id: string;
  transactionId?: string; // Made optional to match usage
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
    notes?: string; // Added to fix ClientInformation errors
  };
  seller?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string; // Added to fix ClientInformation errors
  };
  // Added to fix transaction form related errors
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

export interface PropertyStock {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  rank?: string;
  tier?: string;
  phone?: string; // Added to fix Team component errors
  properties?: number; // Added to fix Team component errors
  transactions?: number; // Added to fix Team component errors
  points?: number;
  sales?: number;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  type: string;
  subtype?: string; // Added for PropertyForm
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  images: File[];
  status: string;
  transactionType?: string;
}

export interface RankRequirement {
  minSalesVolume: number;
  minTransactions: number;
  overrideRate: number;
  rank?: string;
  color?: string;
  personalSales?: number;
  recruitedAgents?: number;
  transactions?: number; // Alias for minTransactions
  salesVolume?: number; // Alias for minSalesVolume
}

export type TransactionFormValues = TransactionFormData;

// Update AgentRank to include all used values
export type AgentRank = 'Associate' | 'Senior Associate' | 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Director' | 'Supreme Leader';
export type TransactionType = 'Sale' | 'Rent' | 'Developer';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review' | 'Ready for Payment' | 'Paid';
