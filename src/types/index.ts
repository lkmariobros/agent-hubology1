
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  avatar?: string;
  sales?: number;
  points?: number;
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

export interface DashboardMetric {
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
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
  area: number;
  images: string[];
  status: 'available' | 'pending' | 'sold';
  listedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  property?: {
    title: string;
    address: {
      city: string;
      state: string;
    };
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
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}
