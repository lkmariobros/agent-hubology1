export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  title?: string;
  description?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: Address;
  type: string;
  subtype: string;
  features: any;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: string;
  listedBy: string;
  agent?: Agent;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  transactionType: string;
  stock?: PropertyStock;
}

export interface PropertyStock {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}

export interface Transaction {
  id: string;
  propertyId: string;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  commission: number;
  status: string;
  date: string;
  property?: {
    title: string;
    address: {
      city: string;
      state: string;
    };
  };
  price?: number;
  type?: string;
  notes?: string;
  documents?: DocumentRecord[];
  agent?: Agent;
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

export interface DocumentRecord {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  size: number;
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
  postedAt: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  tier?: string;
  phone?: string;
  properties?: number;
  transactions?: number;
}

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  rank: AgentRank;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  upline?: AgentWithHierarchy;
  downline: AgentWithHierarchy[];
}

export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export interface RankRequirement {
  rank: AgentRank;
  salesVolume: number;
  transactions: number;
  description: string;
  minTransactions?: number;
  minSalesVolume?: number;
  personalSales?: number;
  recruitedAgents?: number;
}

export interface CommissionTier {
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
}

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  rank: AgentRank;
  percentage: number;
  amount: number;
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

export interface PropertyFormValues {
  title: string;
  description: string;
  type: string;
  subtype: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  features: Record<string, boolean>;
  address: Address;
  images: File[];
  status: string;
  transactionType: string;
}

export interface TransactionFormValues {
  transactionType: string;
  propertyId: string;
  clientId: string;
  clientType: string;
  price: number;
  date: string;
  commissionRate: number;
  commissionAmount: number;
  notes: string;
  documents: File[];
  status: string;
  coBroking: boolean;
  coBrokerId?: string;
  coBrokerCommissionSplit?: number;
}
