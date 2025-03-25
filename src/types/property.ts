
export interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  subtype?: string;
  status: string;
  transactionType: string;
  price: number;
  rentalRate?: number;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    landSize?: number;
  };
  agent?: {
    id: string;
    name: string;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  size?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  stock?: {
    total: number;
    available: number;
  };
  listedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface PropertyFormValues {
  title: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  subtype: string;
  price: number;
  status: 'available' | 'pending' | 'sold';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  images?: any[];
}
