
export interface PropertyAddress {
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
