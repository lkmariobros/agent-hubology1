/**
 * This file contains simplified types for Supabase tables
 * that are compatible with TypeScript's type checking.
 * Use these types when interacting with Supabase to avoid type errors.
 */

export interface AgentProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  agency_id: string;
  upline_id?: string;
  tier: number;
  tier_name: string;
  commission_percentage: number;
  total_sales?: number;
  total_transactions?: number;
  join_date: string;
  updated_at: string;
  license_number?: string;
  specializations?: string[];
}

export interface Notification {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  related_id?: string;
  created_at: string;
  data?: Record<string, any>;
}

export interface PropertyType {
  id: string;
  name: string;
  created_at?: string;
}

export interface TransactionType {
  id: string;
  name: string;
  created_at?: string;
}

export interface PropertyStatus {
  id: string;
  name: string;
  created_at?: string;
}

export interface EnhancedProperty {
  id: string;
  title: string;
  description?: string;
  property_type_id?: string;
  transaction_type_id?: string;
  status_id?: string;
  price?: number;
  rental_rate?: number;
  featured?: boolean;
  agent_id?: string;
  // Address fields
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  // Residential fields
  bedrooms?: number;
  bathrooms?: number;
  built_up_area?: number;
  furnishing_status?: string;
  // Commercial fields
  floor_area?: number;
  zoning_type?: string;
  building_class?: string;
  // Industrial fields
  land_area?: number;
  ceiling_height?: number;
  loading_bays?: number;
  power_capacity?: string;
  // Land fields
  land_size?: number;
  zoning?: string;
  road_frontage?: number;
  topography?: string;
  // Other fields
  agent_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyImage {
  id: string;
  property_id?: string;
  storage_path: string;
  is_cover?: boolean;
  display_order?: number;
  created_at?: string;
}

export interface PropertyDocument {
  id: string;
  property_id?: string;
  name: string;
  storage_path: string;
  document_type?: string;
  created_at?: string;
}

export interface SystemConfiguration {
  key: string;
  value: string;
  description?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface CommissionApproval {
  id: string;
  transaction_id?: string;
  status: string;
  submitted_by?: string;
  reviewer_id?: string;
  threshold_exceeded?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  reviewed_at?: string;
}
