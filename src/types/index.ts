export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  // Add missing properties that are used in components
  tier?: string;
  points?: number;
  sales?: number;
  joinDate?: string;
  transactions?: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  status: string;
  postedBy: string;
  postedDate: string;
  propertyType?: string;
}

export interface Transaction {
  id: string;
  date: string;
  propertyId: string;
  property?: {
    title: string;
  };
  commission: number;
  status: string;
}

export interface PropertyFormValues {
  id?: string;
  title?: string;
  description?: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary';
  propertyType?: string;
  price?: number;
  rentalRate?: number;
  builtUpArea?: number;
  floorArea?: number;
  landArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  status?: string;
  images?: string[];
  features?: string[];
  stock?: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
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

export interface AgentWithHierarchy {
  id: string;
  name: string;
  tier: string;
  commission: number;
  upline?: AgentWithHierarchy;
}

export interface CommissionTier {
  id: string;
  name: string;
  commissionRate: number;
  requirements: string[];
}

export interface CommissionHistory {
  id: string;
  date: string;
  amount: number;
  property: string;
  status: string;
}

export interface OverrideCommission {
  agentId: string;
  amount: number;
}

export interface RankRequirement {
  rank: AgentRank;
  salesTarget: number;
  transactionCount: number;
}

export interface ApprovalStatus {
  status: string;
  count: number;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rentalRate?: number;
  type: string;
  propertyType?: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  area?: number;
  size?: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  features: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  reference?: string;
  agent?: {
    id: string;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}
