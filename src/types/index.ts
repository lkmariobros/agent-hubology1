
// Let's fix the UserRole re-export issue and export all required types
export * from './property';
export * from './commission';
export * from './opportunity';
export * from './transaction';
export * from './api';

// Re-export UserRole with an alias to avoid ambiguity
import { UserRole as AuthUserRole } from './auth';
export type { AuthUserRole as UserRole };

// Export types that are referenced across components
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  tier?: string;
  points?: number;
  sales?: number;
  joinDate?: string;
  transactions?: number;
  phone?: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export type AgentRank = 
  | 'Junior' 
  | 'Agent' 
  | 'Senior' 
  | 'Associate' 
  | 'Senior Associate' 
  | 'Advisor' 
  | 'Sales Leader' 
  | 'Team Leader' 
  | 'Group Leader' 
  | 'Director' 
  | 'Supreme Leader';

export interface RankRequirement {
  rank: AgentRank;
  salesTarget: number;
  transactionCount: number;
}

export interface AgentWithHierarchy {
  id: string;
  name: string;
  tier: string;
  commission: number;
  upline?: AgentWithHierarchy;
  avatar?: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  rank?: string;
  transactions?: number;
  personalCommission?: number;
  overrideCommission?: number;
  totalCommission: number;
  downline?: AgentWithHierarchy[];
  salesVolume?: number;
}

// Export the PropertyFormValues type directly from this file too,
// to avoid the error in components that import it from here
export interface PropertyFormValues {
  title: string;
  description: string;
  price: number;
  propertyType: string;
  builtUpArea: number;
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
  // Additional fields that may be needed
  stock?: {
    total: number;
    available: number;
    reserved?: number;
    sold?: number;
  };
  transactionType?: string;
  size?: number;
}
