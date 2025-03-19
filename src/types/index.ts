
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

export interface Property {
  id: string;
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
  images: string[];
  status: 'available' | 'pending' | 'sold';
  listedBy: string;
  createdAt: string;
  updatedAt: string;
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
