
import { z } from 'zod';

// Transaction types
export type TransactionType = 'Sale' | 'Rent' | 'Primary';

// Status types
export type TransactionStatus = 'Draft' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

// Commission types
export interface CommissionBreakdown {
  transactionValue: number;
  commissionRate: number;
  totalCommission: number;
  agencyShare: number; // 30%
  agentShare: number;  // 70%
  coAgentShare?: number; // If co-broking
}

// Property information
export interface TransactionProperty {
  id?: string;
  title: string;
  type: string;
  address: string;
  price?: number;
  rentalRate?: number;
}

// Client information
export interface TransactionClient {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

// Co-broking information
export interface CoBrokingInfo {
  enabled: boolean;
  agentName: string;
  agentCompany: string;
  agentContact: string;
  commissionSplit: number; // Percentage of the total commission
  credentialsVerified?: boolean; // Add the missing property
}

// Document
export interface TransactionDocument {
  id?: string;
  file?: File;
  name: string;
  documentType: string;
  url?: string;
}

// Core transaction data
export interface TransactionFormData {
  id?: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  transactionDate: Date;
  closingDate?: Date;
  
  // Property details
  propertyId?: string;
  property?: TransactionProperty;
  
  // Client details
  buyer?: TransactionClient;
  seller?: TransactionClient;
  landlord?: TransactionClient;
  tenant?: TransactionClient;
  developer?: TransactionClient;
  
  // Financial details
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  
  // Co-broking
  coBroking: CoBrokingInfo;
  
  // Additional details
  notes: string;
}

// Transaction form state
export interface TransactionFormState {
  formData: TransactionFormData;
  documents: TransactionDocument[];
  currentStep: number;
  isSubmitting: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  errors: Record<string, string>;
}

// Context interface
export interface TransactionFormContextType {
  state: TransactionFormState;
  
  // Actions
  updateFormData: (data: Partial<TransactionFormData>) => void;
  updateTransactionType: (type: TransactionType) => void;
  addDocument: (document: TransactionDocument) => void;
  removeDocument: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  calculateCommission: () => CommissionBreakdown;
  validateCurrentStep: () => boolean;
}

// Validation schemas
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const propertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Property title is required"),
  type: z.string(),
  address: z.string(),
  price: z.number().optional(),
  rentalRate: z.number().optional(),
});

export const coBrokingSchema = z.object({
  enabled: z.boolean(),
  agentName: z.string().min(1, "Agent name is required").optional(),
  agentCompany: z.string().min(1, "Agent company is required").optional(),
  agentContact: z.string().optional(),
  commissionSplit: z.number().min(1).max(99).optional(),
  credentialsVerified: z.boolean().optional(),
});

export const transactionSchema = z.object({
  transactionType: z.enum(['Sale', 'Rent', 'Primary']),
  status: z.enum(['Draft', 'Pending', 'In Progress', 'Completed', 'Cancelled']),
  transactionDate: z.date(),
  closingDate: z.date().optional(),
  propertyId: z.string().optional(),
  transactionValue: z.number().min(0),
  commissionRate: z.number().min(0).max(100),
  commissionAmount: z.number().min(0),
  notes: z.string().optional(),
});
