export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  amenities?: string[];
  type: string;
  status: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  transactionType?: string;
  stock?: {
    total: number;
    available: number;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    landSize?: number;
  };
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio?: string;
  profileImage?: string;
  licenseNumber?: string;
  properties?: Property[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  agentId: string;
  price: number;
  commission: number;
  status: string;
  date: string;
  notes: string;
  closingDate: string;
  property?: {
    title: string;
    address: {
      city: string;
      state: string;
    };
  };
  agent?: {
    id: string;
    name: string;
  };
  buyer: {
    name: string;
    email?: string;
    phone?: string;
  };
  seller: {
    name: string;
    email?: string;
    phone?: string;
  };
  documents?: TransactionDocument[];
}

export interface TransactionFormValues {
  type: 'individual' | 'developer';
  status: string;
  propertyId: string;
  agentId: string;
  buyerId?: string;
  sellerId?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  transactionDate: string | Date;
  closingDate?: string | Date;
  price: number;
  commission: number;
  commissionRate?: number;
  commissionAmount?: number;
  notes?: string;
  commissionSplit?: boolean;
  coAgentId?: string;
  coAgentCommissionPercentage?: number;
  transactionValue?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}
