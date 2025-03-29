
// Simplified Supabase type definitions to avoid deep type instantiations

// Define the basic database schema
export interface Database {
  public: {
    Tables: {
      agent_profiles: {
        Row: {
          id: string;
          full_name?: string;
          email?: string;
          avatar_url?: string;
          agency_id?: string;
          tier?: number;
          tier_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email?: string;
          avatar_url?: string;
          agency_id?: string;
          tier?: number;
          tier_name?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          avatar_url?: string;
          agency_id?: string;
          tier?: number;
          tier_name?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          related_id?: string;
          data?: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          related_id?: string;
          data?: any;
        };
        Update: {
          read?: boolean;
          data?: any;
        };
      };
      property_types: {
        Row: {
          id: string;
          name: string;
          created_at?: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      transaction_types: {
        Row: {
          id: string;
          name: string;
          created_at?: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      property_statuses: {
        Row: {
          id: string;
          name: string;
          created_at?: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      enhanced_properties: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
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
        };
        Update: {
          title?: string;
          property_type_id?: string;
          transaction_type_id?: string;
          status_id?: string;
          description?: string;
          price?: number;
          rental_rate?: number;
          bedrooms?: number;
          bathrooms?: number;
          area?: number;
          features?: string[];
          featured?: boolean;
          street?: string;
          city?: string;
          state?: string;
          zip?: string;
          country?: string;
          latitude?: number;
          longitude?: number;
          agent_notes?: string;
          updated_at?: string;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          is_cover: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          property_id: string;
          storage_path: string;
          is_cover?: boolean;
          display_order?: number;
        };
        Update: {
          is_cover?: boolean;
          display_order?: number;
        };
      };
      property_documents: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          name: string;
          document_type: string;
          created_at: string;
        };
        Insert: {
          property_id: string;
          storage_path: string;
          name: string;
          document_type: string;
        };
        Update: {
          name?: string;
          document_type?: string;
        };
      };
      commission_approvals: {
        Row: {
          id: string;
          transaction_id: string;
          status: string;
          submitted_by: string;
          reviewer_id?: string;
          notes?: string;
          threshold_exceeded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          transaction_id: string;
          status: string;
          submitted_by: string;
          reviewer_id?: string;
          notes?: string;
          threshold_exceeded: boolean;
        };
        Update: {
          status?: string;
          reviewer_id?: string;
          notes?: string;
          updated_at?: string;
        };
      };
      system_configuration: {
        Row: {
          key: string;
          value: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          description?: string;
        };
        Update: {
          value?: string;
          description?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_approval_counts: {
        Args: Record<string, never>;
        Returns: { status: string; count: number }[];
      };
      get_pending_commission_total: {
        Args: Record<string, never>;
        Returns: { total: number };
      };
      get_approved_commission_total: {
        Args: Record<string, never>;
        Returns: { total: number };
      };
      update_commission_approval_status: {
        Args: {
          p_approval_id: string;
          p_new_status: string;
          p_notes?: string;
        };
        Returns: { success: boolean; message: string };
      };
    };
  };
}
