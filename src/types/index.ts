
import React from 'react';

export interface DashboardMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  squareFeet: number;
  landSize?: number;
  // Add any other feature properties here
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
  type: string;
  status: string; // Changed from enum to string to handle different cases
  transactionType: string;
  price: number;
  rentalRate?: number;
  address: Address;
  features: PropertyFeatures;
  agent: {
    id: string;
    name: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  subtype?: string;
  size?: number; // Added to match usage in PropertyDetail
  area?: number;
  bedrooms?: number; // Added for direct access
  bathrooms?: number; // Added for direct access
  stock?: PropertyStock; // Changed to use PropertyStock interface
  listedBy?: string; // Added to match usage in data files
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  avatar?: string;
  phone?: string;
  properties?: number;
  transactions?: number;
}

export interface CommissionTier {
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  property?: {
    title: string;
    address: {
      city: string;
      state: string;
    }
  };
  agentId: string;
  agent?: {
    name: string;
    email: string;
  };
  buyerId?: string;
  buyer?: {
    name: string;
  };
  sellerId?: string;
  seller?: {
    name: string;
  };
  price?: number;
  commission: number;
  status: string;
  date: string;
  type?: 'individual' | 'developer'; // Added transaction type
  documents?: string[]; // Added for document uploads
  notes?: string; // Added for additional notes
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  budget: string;
  location: string;
  status: 'Urgent' | 'New' | 'Featured' | 'Regular';
  postedBy: string;
  postedAt: string;
}

// API response interfaces - for use with backend integration
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Added for transaction form
export interface TransactionFormValues {
  type: 'individual' | 'developer';
  date: Date | string;
  status: string;
  propertyId: string;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  price: number;
  commission: number;
  documents?: File[];
  notes?: string;
}

// Added for property form
export interface PropertyFormValues {
  title: string;
  description: string;
  price: number;
  address: Address;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: File[];
  status: 'available' | 'pending' | 'sold';
}

// Agent Hierarchy related types
export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rank: AgentRank;
  uplineId?: string;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
}

export interface AgentWithHierarchy extends Agent {
  upline?: AgentWithHierarchy;
  downline?: AgentWithHierarchy[];
}

export interface OverrideCommission {
  agentId: string;
  agentName: string;
  rank: AgentRank;
  percentage: number;
  amount: number;
}

export interface RankRequirement {
  rank: AgentRank;
  minTransactions: number;
  minSalesVolume: number;
  personalSales: boolean;
  recruitedAgents?: number;
  color: string;
}

export interface CommissionSummary {
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  currentMonth: {
    earned: number;
    target: number;
    progress: number;
  };
  previousMonth: {
    earned: number;
    target: number;
    progress: number;
  };
  yearToDate: {
    earned: number;
    target: number;
    progress: number;
  };
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
  source?: string; // Name of the agent who generated the override commission
}
