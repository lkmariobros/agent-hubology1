
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
  downline?: AgentWithHierarchy[];
}

export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

// Commission Types
export interface CommissionTier {
  name: string;
  percentage: number;
  requirements: string[];
  requiredSales: number;
}

export interface RankRequirement {
  rank: AgentRank;
  salesTarget: number;
  transactionCount: number;
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
  date: string | Date;
  amount: number;
  type: 'personal' | 'override';
  status: 'pending' | 'approved' | 'paid';
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
  };
  client: {
    id: string;
    name: string;
  };
  agent: {
    id: string;
    name: string;
  };
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
