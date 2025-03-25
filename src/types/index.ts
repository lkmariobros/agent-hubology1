
export * from './property';
export * from './transaction-form';
export * from './notification';

// Dashboard Types
export interface DashboardMetric {
  label: string;
  value: string;
  percentChange?: number;
  timeframe?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: number; // Added missing property
}

// Agent Types
export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rank: string;
  joinDate: string | Date;
  transactions: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  salesVolume?: number; // Added missing property
  upline?: AgentWithHierarchy; // Added missing property
  downline?: AgentWithHierarchy[];
}

export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

// Commission Types
export interface CommissionTier {
  name: string;
  percentage: number;
  requirements: string[];
  requiredSales: number;
  tier: string; // Added missing property
  rate: number; // Added missing property
  minTransactions: number; // Added missing property
  color: string; // Added missing property
}

export interface RankRequirement {
  rank: AgentRank;
  salesTarget: number;
  transactionCount: number;
  minTransactions?: number; // Added missing property
  minSalesVolume?: number; // Added missing property 
  personalSales?: number; // Added missing property
  recruitedAgents?: number; // Added missing property
  additionalRequirements?: string[];
}

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  rank: string;
  percentage: number;
  amount: number;
}

export interface CommissionHistory {
  id: string;
  transactionId?: string;
  date: string | Date;
  amount: number;
  type: 'personal' | 'override';
  status?: 'pending' | 'approved' | 'paid';
  source?: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
}

export interface CommissionBreakdownProps {
  totalCommission: number;
  agencyCommission: number;
  agentCommission: number;
  personalCommission?: number;
  overrideCommission?: number;
  agentShare?: number; // Added missing property
  agencyShare?: number; // Added missing property
  commissionRate?: number; // Added missing property
  transactionValue?: number; // Added missing property
  ourAgencyCommission?: number; // Added missing property
  coAgencyCommission?: number; // Added missing property
  overrides?: {
    id: string;
    name: string;
    rank: string;
    amount: number;
  }[];
}

// Transaction Types
export interface Transaction {
  id: string;
  date: string | Date;
  amount: number;
  type: string;
  status: string;
  property: {
    id: string;
    title: string;
    type: string;
    address?: {
      city: string;
      state: string;
    };
  };
  propertyId?: string; // Added missing property
  client: {
    id: string;
    name: string;
  };
  agent: {
    id: string;
    name: string;
    email?: string; // Added missing property
  };
  price?: number; // Added missing property
  commission?: number; // Added missing property
  buyer?: any; // Added missing property
  seller?: any; // Added missing property
  notes?: string; // Added missing property
  documents?: any[]; // Added missing property
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  team: string;
  joinDate: string | Date;
  rank?: string;
  tier?: string; // Added missing property
  phone?: string; // Added missing property
  properties?: any[]; // Added missing property
  sales?: number;
  transactions?: number;
  points?: number;
  badges?: string[];
}

// Opportunity Types
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  budget: number;
  location: string;
  isUrgent: boolean;
  isNew: boolean;
  createdAt: string | Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// API Types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
  message?: string; // Added missing property
  success?: boolean; // Added missing property
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
}

// PropertyStock for reuse
export interface PropertyStock {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}
