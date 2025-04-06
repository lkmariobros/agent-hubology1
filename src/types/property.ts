
export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
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
  price: number;
  address: PropertyAddress;
  type: string;
  subtype: string;
  listedBy: string;
  features: string[];
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  status: 'available' | 'pending' | 'sold' | 'rented';
  images: string[];
  createdAt: string;
  updatedAt: string;
  area: number;
  size: number;
  agent?: PropertyAgent;
  // Adding missing properties that were causing errors
  stock?: PropertyStock;
  featured?: boolean;
  transactionType?: string;
  reference?: string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// This is needed for property forms and was missing
export interface PropertyFormValues {
  title: string;
  description: string;
  price: number;
  propertyType: string;
  builtUpArea: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  status: string;
  address: PropertyAddress;
  images: string[];
  // Additional fields that may be needed
  stock?: PropertyStock;
  transactionType?: string;
  size?: number;
}
