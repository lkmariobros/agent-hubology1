
/**
 * This file contains simplified type definitions for database operations
 * to avoid complex type instantiation issues with the Supabase client.
 */

// Agent profile type
export interface AgentProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  agency_id?: string;
  tier?: number;
  tier_name?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// Property type
export interface Property {
  id: string;
  title: string;
  property_type_id: string;
  transaction_type_id: string;
  status_id: string;
  description: string;
  price: number;
  rental_rate?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  featured: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
  agent_notes?: string;
  agent_id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// Property image type
export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  created_at?: string;
  [key: string]: any;
}

// Property document type
export interface PropertyDocument {
  id: string;
  property_id: string;
  storage_path: string;
  name: string;
  document_type: string;
  created_at?: string;
  [key: string]: any;
}

// Notification type
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  related_id?: string;
  data?: any;
  created_at: string;
  [key: string]: any;
}

// Commission approval type
export interface CommissionApproval {
  id: string;
  transaction_id: string;
  status: string;
  submitted_by: string;
  reviewer_id?: string;
  notes?: string;
  threshold_exceeded: boolean;
  created_at?: string;
  updated_at?: string;
  transaction?: {
    id: string;
    property_id: string;
    property_title?: string;
    commission_amount: number;
    transaction_date: string;
    agent_id: string;
    agent_name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// System configuration type
export interface SystemConfiguration {
  key: string;
  value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}
