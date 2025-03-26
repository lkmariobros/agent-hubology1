
export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export interface RankRequirement {
  rank: AgentRank;
  transactions: number;
  salesVolume: number;
  personalSales: boolean;
  recruitedAgents?: number;
  color?: string;
}

// Approval Status Types
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

// Agent Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tier?: string;
}

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rank: AgentRank;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  downline?: AgentWithHierarchy[];
  upline?: AgentWithHierarchy;
}

// Commission Types
export interface CommissionTier {
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
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
}

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  rank: AgentRank;
  percentage: number;
  amount: number;
}

// Property Types
export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  landSize?: number;
  [key: string]: any;
}

export interface PropertyStock {
  total: number;
  available: number;
  reserved?: number;
  sold?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: PropertyAddress;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype: string;
  features?: PropertyFeatures | string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  status: 'available' | 'pending' | 'sold';
  listedBy?: string;
  agent?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  transactionType?: string;
  stock?: PropertyStock;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  price: number;
  type: string;
  subtype: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  images: string[];
}

// Transaction Types
export interface Transaction {
  id: string;
  propertyId: string;
  agentId: string;
  price?: number;
  commission: number;
  status: string;
  date: string;
  property?: {
    title: string;
    address?: {
      city: string;
      state: string;
    }
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
}

export interface TransactionFormValues {
  propertyId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  transactionDate: Date;
  closingDate?: Date;
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  notes: string;
  status: string;
  commissionSplit: boolean;
  coAgentId?: string;
  coAgentCommissionPercentage?: number;
}

// Dashboard Types
export interface DashboardMetric {
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  budget: string;
  location: string;
  status: 'Urgent' | 'New' | 'Featured' | 'Pending' | 'Closed';
  postedBy: string;
  postedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Approval Comments
export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  content: string;
  created_by: string;
  created_at: string;
}
