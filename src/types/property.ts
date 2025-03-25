
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  type: string;
  subtype?: string;
  features?: string[];
  images?: string[];
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
  listedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface PropertyFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  location?: string;
  features?: string[];
  searchQuery?: string;
  title?: string;
  bedrooms?: number;
  propertyType?: string;
  bathrooms?: number;
}
