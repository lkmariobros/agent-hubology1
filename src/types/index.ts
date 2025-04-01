export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  agentId: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  actualPaymentDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  transaction?: any;
  // Snake case alternatives for API compatibility
  transaction_id?: string;
  installment_number?: number;
  agent_id?: string;
  scheduled_date?: string;
  actual_payment_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionForecast {
  month: string;
  totalAmount: number;
  installments: CommissionInstallment[];
  // Snake case alternatives for API compatibility
  total_amount?: number;
}

export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: PaymentScheduleInstallment[];
}

export interface PaymentScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  daysAfterTransaction: number;
  percentage: number;
  description?: string;
}

// Alias for backward compatibility
export type ScheduleInstallment = PaymentScheduleInstallment;

export interface PropertyFormValues {
  id?: string;
  title: string;
  description: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary';
  propertyType: string;
  price: number;
  rentalRate?: number;
  builtUpArea?: number;
  floorArea?: number;
  landArea?: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  status: 'Available' | 'Under Offer' | 'Pending' | 'Sold' | 'Rented';
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  images: any[]; // Add this property for file uploads
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
  subtype?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  agent?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string; // Add email field
    phone?: string;
  };
  stock?: {
    total: number;
    available: number;
    reserved?: number;
    sold?: number;
  };
  featured?: boolean; // Added for compatibility
  createdAt: string;
  updatedAt: string;
  transactionType?: 'Sale' | 'Rent' | 'Primary'; // Added for PropertyCard
}
