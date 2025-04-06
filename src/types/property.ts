export interface PropertyFormValues {
  id?: string;
  title?: string;
  description?: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary';
  propertyType?: string;
  price?: number;
  rentalRate?: number;
  builtUpArea?: number;
  floorArea?: number;
  landArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  status?: string;
  images?: string[];
  features?: string[];
  featured?: boolean; // Added this property
  furnishingStatus?: string;
  zoningType?: string;
  buildingClass?: string;
  ceilingHeight?: number;
  loadingBays?: number;
  powerCapacity?: string;
  landSize?: number;
  zoning?: string;
  roadFrontage?: number;
  topography?: string;
  agentNotes?: string;
  stock?: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rentalRate?: number;
  type: string;
  propertyType?: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea?: number;
  area?: number;
  size?: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  features: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  reference?: string;
  agent?: {
    id: string;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  featured?: boolean;
  stock?: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  subtype?: string;
  transactionType?: string;
}
