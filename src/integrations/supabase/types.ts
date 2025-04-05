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
      agencies: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      agent_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          first_name: string
          id: string
          invitation_code: string
          last_name: string
          status: string
          upline_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          first_name: string
          id?: string
          invitation_code: string
          last_name: string
          status?: string
          upline_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          first_name?: string
          id?: string
          invitation_code?: string
          last_name?: string
          status?: string
          upline_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_invitations_upline_id_fkey"
            columns: ["upline_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          agency_id: string
          avatar_url: string | null
          commission_percentage: number
          email: string | null
          full_name: string | null
          id: string
          join_date: string
          license_number: string | null
          phone: string | null
          specializations: string[] | null
          tier: number
          tier_name: string
          total_sales: number | null
          total_transactions: number | null
          updated_at: string
          upline_id: string | null
        }
        Insert: {
          agency_id?: string
          avatar_url?: string | null
          commission_percentage?: number
          email?: string | null
          full_name?: string | null
          id: string
          join_date?: string
          license_number?: string | null
          phone?: string | null
          specializations?: string[] | null
          tier?: number
          tier_name?: string
          total_sales?: number | null
          total_transactions?: number | null
          updated_at?: string
          upline_id?: string | null
        }
        Update: {
          agency_id?: string
          avatar_url?: string | null
          commission_percentage?: number
          email?: string | null
          full_name?: string | null
          id?: string
          join_date?: string
          license_number?: string | null
          phone?: string | null
          specializations?: string[] | null
          tier?: number
          tier_name?: string
          total_sales?: number | null
          total_transactions?: number | null
          updated_at?: string
          upline_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_upline_id_fkey"
            columns: ["upline_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agency"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
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
      commission_forecast_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      commission_installments: {
        Row: {
          actual_payment_date: string | null
          agent_id: string
          amount: number
          created_at: string | null
          id: string
          installment_number: number
          notes: string | null
          percentage: number
          scheduled_date: string
          status: string
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          actual_payment_date?: string | null
          agent_id: string
          amount: number
          created_at?: string | null
          id?: string
          installment_number: number
          notes?: string | null
          percentage: number
          scheduled_date: string
          status?: string
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          actual_payment_date?: string | null
          agent_id?: string
          amount?: number
          created_at?: string | null
          id?: string
          installment_number?: number
          notes?: string | null
          percentage?: number
          scheduled_date?: string
          status?: string
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commission_payment_schedules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
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
      forecast_projections: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          id: string
          installment_number: number
          percentage: number
          projected_transaction_id: string
          scheduled_date: string
          status: string
          transaction_date: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount: number
          created_at?: string
          id?: string
          installment_number: number
          percentage: number
          projected_transaction_id: string
          scheduled_date: string
          status?: string
          transaction_date: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          id?: string
          installment_number?: number
          percentage?: number
          projected_transaction_id?: string
          scheduled_date?: string
          status?: string
          transaction_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
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
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
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
          installments_generated: boolean | null
          listing_fee: number | null
          notes: string | null
          payment_schedule_id: string | null
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
          installments_generated?: boolean | null
          listing_fee?: number | null
          notes?: string | null
          payment_schedule_id?: string | null
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
          installments_generated?: boolean | null
          listing_fee?: number | null
          notes?: string | null
          payment_schedule_id?: string | null
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
            foreignKeyName: "property_transactions_payment_schedule_id_fkey"
            columns: ["payment_schedule_id"]
            isOneToOne: false
            referencedRelation: "commission_payment_schedules"
            referencedColumns: ["id"]
          },
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
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_installments: {
        Row: {
          created_at: string | null
          days_after_transaction: number
          description: string | null
          id: string
          installment_number: number
          percentage: number
          schedule_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_after_transaction: number
          description?: string | null
          id?: string
          installment_number: number
          percentage: number
          schedule_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_after_transaction?: number
          description?: string | null
          id?: string
          installment_number?: number
          percentage?: number
          schedule_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_installments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "commission_payment_schedules"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          p_invitation_code: string
          p_user_id: string
        }
        Returns: Json
      }
      assign_role_to_user: {
        Args: {
          p_user_id: string
          p_role_name: string
        }
        Returns: boolean
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      calculate_commission_forecast_totals: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          total_amount: number
          scheduled_count: number
        }[]
      }
      expire_old_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_agent_profile_by_id: {
        Args: {
          user_id: string
        }
        Returns: {
          agency_id: string
          avatar_url: string | null
          commission_percentage: number
          email: string | null
          full_name: string | null
          id: string
          join_date: string
          license_number: string | null
          phone: string | null
          specializations: string[] | null
          tier: number
          tier_name: string
          total_sales: number | null
          total_transactions: number | null
          updated_at: string
          upline_id: string | null
        }[]
      }
      get_commission_approval_detail: {
        Args: {
          p_approval_id: string
        }
        Returns: Json
      }
      get_commission_approval_installments: {
        Args: {
          p_approval_id: string
        }
        Returns: Json[]
      }
      get_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }[]
      }
      get_permissions_by_category: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          permissions: Json
        }[]
      }
      get_permissions_simple: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }[]
      }
      get_team_performance_metrics: {
        Args: {
          p_agent_id: string
        }
        Returns: Json
      }
      get_user_roles: {
        Args: {
          p_user_id: string
        }
        Returns: {
          role_name: string
          role_id: string
        }[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      has_role: {
        Args: {
          p_user_id: string
          p_role_name: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_tier: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_reviewer: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      property_belongs_to_agent: {
        Args: {
          property_id: string
          agent_id: string
        }
        Returns: boolean
      }
      resend_agent_invitation: {
        Args: {
          p_invitation_id: string
        }
        Returns: Json
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      update_commission_approval_status: {
        Args: {
          p_approval_id: string
          p_new_status: string
          p_notes?: string
        }
        Returns: Json
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      verify_invitation_code: {
        Args: {
          p_invitation_code: string
        }
        Returns: Json
      }
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
