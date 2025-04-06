
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
