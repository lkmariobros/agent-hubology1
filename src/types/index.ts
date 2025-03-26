
export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  area?: number;
  amenities?: string[];
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    landSize?: number;
  };
  type: string;
  subtype?: string;
  status: string;
  isFeatured?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  transactionType?: string;
  stock?: PropertyStock;
  listedBy?: string;
  agent?: Agent;
}

export interface PropertyStock {
  total: number;
  available: number;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  type: string;
  transactionType: string;
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  images?: File[];
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio?: string;
  profileImage?: string;
  licenseNumber?: string;
  properties?: Property[];
  createdAt?: string;
  updatedAt?: string;
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
  closingDate: string;
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
  buyer: {
    name: string;
    email?: string;
    phone?: string;
  };
  seller: {
    name: string;
    email?: string;
    phone?: string;
  };
  documents?: TransactionDocument[];
}

export interface TransactionDocument {
  id?: string;
  name: string;
  documentType: string;
  file?: File;
  url?: string;
}

export interface TransactionFormValues {
  type: 'individual' | 'developer';
  status: string;
  propertyId: string;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  transactionDate: string | Date;
  closingDate?: string | Date;
  price: number;
  commission: number;
  commissionRate?: number;
  commissionAmount?: number;
  notes?: string;
  commissionSplit?: boolean;
  coAgentId?: string;
  coAgentCommissionPercentage?: number;
  transactionValue?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

// Missing types needed for commission components
export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rank: AgentRank;
  avatar?: string;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  downline?: AgentWithHierarchy[];
  upline?: AgentWithHierarchy;
}

export interface CommissionTier {
  id: string;
  tier: string;
  minTransactions: number;
  rate: number;
  color: string;
}

export interface CommissionHistory {
  id: string;
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

export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

export interface RankRequirement {
  rank: AgentRank;
  transactions: number;
  salesVolume: number;
  personalSales: boolean;
  recruitedAgents?: number;
  color: string;
}

// Dashboard types
export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  period?: string;
  status?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  status: 'Urgent' | 'New' | 'Featured' | 'Regular';
  propertyType: string;
  location: string;
  budget: string;
  postedBy: string;
  postedDate: string;
  expiryDate?: string;
  contactDetails?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  tier?: string;
  joinDate?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
