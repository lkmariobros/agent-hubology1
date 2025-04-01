
export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  agentId: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  actualPaymentDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  transaction?: any;
  // Snake case alternatives for API compatibility
  transaction_id?: string;
  installment_number?: number;
  agent_id?: string;
  scheduled_date?: string;
  actual_payment_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionForecast {
  month: string;
  totalAmount: number;
  installments: CommissionInstallment[];
  // Snake case alternatives for API compatibility
  total_amount?: number;
}

export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: PaymentScheduleInstallment[];
}

export interface PaymentScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  daysAfterTransaction: number;
  percentage: number;
  description?: string;
}

// Alias for backward compatibility
export type ScheduleInstallment = PaymentScheduleInstallment;

export interface PropertyFormValues {
  id?: string;
  title: string;
  description: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary';
  propertyType: string;
  price: number;
  rentalRate?: number;
  builtUpArea?: number;
  floorArea?: number;
  landArea?: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  status: 'Available' | 'Under Offer' | 'Pending' | 'Sold' | 'Rented';
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  images: any[]; // Add this property for file uploads
  agentNotes?: string;
  stock?: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  type?: string; // Added for backward compatibility
  area?: number; // Added for backward compatibility
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rentalRate?: number;
  type: string;
  subtype?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  agent?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  stock?: {
    total: number;
    available: number;
    reserved?: number;
    sold?: number;
  };
  featured?: boolean;
  reference?: string;
  size?: number; // For sample properties compatibility
  createdAt: string;
  updatedAt: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary';
}

// Agent and Commission related types
export type AgentRank = 
  | 'Junior Agent'
  | 'Agent'
  | 'Senior Agent'
  | 'Team Leader'
  | 'Sales Leader'
  | 'Group Leader'
  | 'Associate Director'
  | 'Director';

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rank?: string;
  tier?: string;
  joinDate?: string;
  transactions?: number;
  salesVolume?: number;
  personalCommission?: number;
  overrideCommission?: number;
  totalCommission?: number;
  downline?: AgentWithHierarchy[];
  downlines?: AgentWithHierarchy[];
}

export interface CommissionTier {
  id: string;
  name: string;
  tier?: string;
  rate?: number;
  minTransactions?: number;
  color?: string;
  rank?: string;
  agentPercentage: number;
}

export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  percentage: number;
  amount: number;
  status: string;
  agentName?: string;
  rank?: AgentRank;
  tier?: string;
}

export interface CommissionHistory {
  id: string;
  transactionId: string;
  transactionReference?: string;
  date: string;
  amount: number;
  status: string;
  type?: string;
  source?: string;
  property?: {
    title: string;
    location: string;
  };
}

export interface ApprovalStatus {
  id: string;
  name: string;
  color: string;
}

export interface RankRequirement {
  id: string;
  rank: AgentRank;
  minTransactions: number;
  minSalesVolume: number;
}

// Dashboard types
export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  clientName: string;
  propertyAddress: string;
  amount: number;
  status: string;
  type: string;
  agentId?: string;
  agentName?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  propertyType: string;
  createdAt: string;
  status: string;
  urgency: 'low' | 'medium' | 'high';
  clientId?: string;
  clientName?: string;
  agentId?: string;
  agentName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  properties?: any[];
  sales?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
