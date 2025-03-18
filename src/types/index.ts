
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'admin' | 'manager';
  tier: 'junior' | 'associate' | 'senior' | 'principal' | 'director';
  avatar?: string;
  teamId?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  status: 'available' | 'pending' | 'sold';
  listedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  property?: Property;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  members: string[];
  goals: {
    period: string;
    target: number;
    achieved: number;
  }[];
}

export interface CommissionTier {
  tier: string;
  minTransactions: number;
  rate: number;
  color: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
}
