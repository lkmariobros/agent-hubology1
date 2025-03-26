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
