
// Re-export all types for convenient imports
export * from './auth';
export * from './role';
export * from './user';
export * from './property';
export * from './transaction';
export * from './opportunity';

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Property type definitions
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: Address;
  type: PropertyType;
  subtype: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  status: 'available' | 'pending' | 'sold' | 'rented';
  listedBy: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties for the PropertyCard component
  stock?: {
    total?: number;
    available?: number;
    sold?: number;
  };
  size?: number; // Allow size property for compatibility
  featured?: boolean;
  transactionType?: string;
  reference?: string;
  agent?: {
    name?: string;
    avatar?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  builtUpArea?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'land';

// Transaction type definitions
export interface Transaction {
  id: string;
  propertyId: string;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  commission: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
}

// Opportunity type definitions
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

// Dashboard metric definition
export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

// Commission types
export interface CommissionTier {
  id: string;
  name: string;
  threshold: number;
  percentage: number;
  description?: string;
  // Additional properties used in components
  tier?: string;
  rate?: number;
  minTransactions?: number;
  color?: string;
}

export interface CommissionHistory {
  id: string;
  date: string;
  amount: number;
  transactionId: string;
  property?: string;
  status: string;
  // Additional properties used in components
  type?: string;
  source?: string;
}

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  percentage: number;
  amount: number;
  id?: string; // Added for compatibility
}

// Agent with hierarchy for team view
export interface AgentWithHierarchy {
  id: string;
  name: string;
  tier: string;
  avatar?: string;
  email?: string;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  downline?: AgentWithHierarchy[];
}
