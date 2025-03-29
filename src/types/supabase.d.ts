
// This is a more comprehensive type definition for the Supabase database
// In a real app, this would be generated from the Supabase schema

export type Database = {
  public: {
    Tables: {
      // Agent profiles
      agent_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          phone: string | null;
          agency_id: string;
          upline_id: string | null;
          tier: number;
          tier_name: string;
          commission_percentage: number;
          total_sales: number | null;
          total_transactions: number | null;
          join_date: string;
          updated_at: string;
          license_number: string | null;
          specializations: string[] | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          agency_id?: string;
          upline_id?: string | null;
          tier?: number;
          tier_name?: string;
          commission_percentage?: number;
          total_sales?: number | null;
          total_transactions?: number | null;
          join_date?: string;
          updated_at?: string;
          license_number?: string | null;
          specializations?: string[] | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          agency_id?: string;
          upline_id?: string | null;
          tier?: number;
          tier_name?: string;
          commission_percentage?: number;
          total_sales?: number | null;
          total_transactions?: number | null;
          join_date?: string;
          updated_at?: string;
          license_number?: string | null;
          specializations?: string[] | null;
        };
      };
      // Agencies
      agencies: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      // Enhanced properties
      enhanced_properties: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          property_type_id: string | null;
          transaction_type_id: string | null;
          status_id: string | null;
          // Add other fields as needed
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          property_type_id?: string | null;
          transaction_type_id?: string | null;
          status_id?: string | null;
          // Add other fields as needed
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          property_type_id?: string | null;
          transaction_type_id?: string | null;
          status_id?: string | null;
          // Add other fields as needed
        };
      };
      // Notifications
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          message: string;
          read: boolean | null;
          related_id: string | null;
          created_at: string | null;
          data?: any;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          title: string;
          message: string;
          read?: boolean | null;
          related_id?: string | null;
          created_at?: string | null;
          data?: any;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean | null;
          related_id?: string | null;
          created_at?: string | null;
          data?: any;
        };
      };
      // Add other tables as needed
    };
    Views: {
      // Add views if needed
    };
    Functions: {
      // Add functions if needed
    };
  };
};
