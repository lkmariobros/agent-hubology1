export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approval_comments: {
        Row: {
          approval_id: string | null
          comment_text: string
          created_at: string | null
          created_by: string | null
          id: string
        }
        Insert: {
          approval_id?: string | null
          comment_text: string
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Update: {
          approval_id?: string | null
          comment_text?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_comments_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "commission_approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_history: {
        Row: {
          approval_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
        }
        Insert: {
          approval_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
        }
        Update: {
          approval_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_history_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "commission_approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_approvals: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          submitted_by: string | null
          threshold_exceeded: boolean | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_by?: string | null
          threshold_exceeded?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_by?: string | null
          threshold_exceeded?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_approvals_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "property_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      enhanced_properties: {
        Row: {
          agent_id: string | null
          agent_notes: string | null
          bathrooms: number | null
          bedrooms: number | null
          building_class: string | null
          built_up_area: number | null
          ceiling_height: number | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          floor_area: number | null
          furnishing_status: string | null
          id: string
          land_area: number | null
          land_size: number | null
          loading_bays: number | null
          power_capacity: string | null
          price: number | null
          property_type_id: string | null
          rental_rate: number | null
          road_frontage: number | null
          state: string | null
          status_id: string | null
          street: string | null
          title: string
          topography: string | null
          transaction_type_id: string | null
          updated_at: string | null
          zip: string | null
          zoning: string | null
          zoning_type: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_notes?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_class?: string | null
          built_up_area?: number | null
          ceiling_height?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          floor_area?: number | null
          furnishing_status?: string | null
          id?: string
          land_area?: number | null
          land_size?: number | null
          loading_bays?: number | null
          power_capacity?: string | null
          price?: number | null
          property_type_id?: string | null
          rental_rate?: number | null
          road_frontage?: number | null
          state?: string | null
          status_id?: string | null
          street?: string | null
          title: string
          topography?: string | null
          transaction_type_id?: string | null
          updated_at?: string | null
          zip?: string | null
          zoning?: string | null
          zoning_type?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_notes?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_class?: string | null
          built_up_area?: number | null
          ceiling_height?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          floor_area?: number | null
          furnishing_status?: string | null
          id?: string
          land_area?: number | null
          land_size?: number | null
          loading_bays?: number | null
          power_capacity?: string | null
          price?: number | null
          property_type_id?: string | null
          rental_rate?: number | null
          road_frontage?: number | null
          state?: string | null
          status_id?: string | null
          street?: string | null
          title?: string
          topography?: string | null
          transaction_type_id?: string | null
          updated_at?: string | null
          zip?: string | null
          zoning?: string | null
          zoning_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enhanced_properties_property_type_id_fkey"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enhanced_properties_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "property_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enhanced_properties_transaction_type_id_fkey"
            columns: ["transaction_type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          id: string
          name: string
          property_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          id?: string
          name: string
          property_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          id?: string
          name?: string
          property_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "enhanced_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_cover: boolean | null
          property_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_cover?: boolean | null
          property_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_cover?: boolean | null
          property_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "enhanced_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_statuses: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_transactions: {
        Row: {
          agent_id: string | null
          buyer_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          closing_date: string | null
          co_agent_commission_percentage: number | null
          co_agent_id: string | null
          commission_amount: number | null
          commission_rate: number | null
          commission_split: boolean | null
          created_at: string | null
          id: string
          listing_fee: number | null
          notes: string | null
          property_id: string | null
          seller_email: string | null
          seller_name: string | null
          seller_phone: string | null
          status: string | null
          transaction_date: string
          transaction_type_id: string | null
          transaction_value: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          closing_date?: string | null
          co_agent_commission_percentage?: number | null
          co_agent_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          commission_split?: boolean | null
          created_at?: string | null
          id?: string
          listing_fee?: number | null
          notes?: string | null
          property_id?: string | null
          seller_email?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string | null
          transaction_date: string
          transaction_type_id?: string | null
          transaction_value?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          closing_date?: string | null
          co_agent_commission_percentage?: number | null
          co_agent_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          commission_split?: boolean | null
          created_at?: string | null
          id?: string
          listing_fee?: number | null
          notes?: string | null
          property_id?: string | null
          seller_email?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string | null
          transaction_date?: string
          transaction_type_id?: string | null
          transaction_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "enhanced_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_transactions_transaction_type_id_fkey"
            columns: ["transaction_type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      system_configuration: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      transaction_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          id: string
          name: string
          storage_path: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          id?: string
          name: string
          storage_path: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          id?: string
          name?: string
          storage_path?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "property_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
