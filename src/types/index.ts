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
}

export interface CommissionTier {
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
}

// Extend the User interface with additional properties if they don't exist
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  tier: string;
  avatar?: string;
  properties?: number;
  transactions?: number;
}

// Extend the Transaction interface with additional properties
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
