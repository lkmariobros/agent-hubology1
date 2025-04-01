
// Agent rank type
export type AgentRank = 'Junior' | 'Agent' | 'Senior' | 'Associate' | 'Director' | 
  'Senior Associate' | 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

// Property status type
export type PropertyStatus = 'Available' | 'Pending' | 'Sold' | 'Reserved' | 'Expired';

// Transaction status type
export type TransactionStatus = 'Draft' | 'Pending' | 'Completed' | 'Cancelled';

// User role type 
export type UserRole = 'agent' | 'admin' | 'viewer' | 'team_leader' | 'finance';

// Approval status type
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Ready for Payment' | 'Paid' | 'Rejected';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Property and transaction related types
export interface Property {
  id: string;
  title: string;
  description?: string;
  price?: number;
  rentalRate?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  type?: string;
  subtype?: string;
  features?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  status?: string;
  listedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  stock?: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
}

export interface Transaction {
  id: string;
  propertyId?: string;
  property?: Property;
  agentId?: string;
  buyerId?: string;
  sellerId?: string;
  commission?: number;
  status?: string;
  date?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  propertyType?: string;
  budget?: string;
  location?: string;
  status?: string;
  postedBy?: string;
  postedDate?: string;
}

// Dashboard related types
export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

// User and agent related types
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  tier?: string;
  joinDate?: string;
  transactions?: number;
  salesVolume?: number;
  points?: number;
}

export interface AgentWithHierarchy {
  id: string;
  name: string;
  tier: AgentRank;
  avatar?: string;
  email?: string;
  phone?: string;
  salesVolume?: number;
  transactions?: number;
  commissionRate?: number;
  upline?: AgentWithHierarchy | null;
  downlines?: AgentWithHierarchy[];
}

// Commission related types
export interface CommissionHistory {
  id: string;
  date: string;
  amount: number;
  transactionId: string;
  propertyTitle?: string;
  status: string;
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

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  tier: string;
  amount: number;
}

export interface RankRequirement {
  minSalesVolume: number;
  minTransactions: number;
  overrideRate: number;
  rank?: string;
  color?: string;
  personalSales?: number;
  recruitedAgents?: number;
}

// Property form values
export interface PropertyFormValues {
  id?: string;
  title: string;
  description: string;
  transactionType: 'Sale' | 'Rent' | 'Primary';
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  featured: boolean;
  status: 'Available' | 'Under Offer' | 'Pending' | 'Sold' | 'Rented';
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  price: number | null;
  rentalRate: number | null;
  bedrooms?: number;
  bathrooms?: number;
  builtUpArea?: number;
  furnishingStatus?: 'Unfurnished' | 'Partially Furnished' | 'Fully Furnished';
  floorArea?: number;
  landArea?: number;
  agentNotes?: string;
}
