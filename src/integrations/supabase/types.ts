export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      discovery_report_private: {
        Row: {
          created_at: string
          discovery_run_id: string
          full_report: Json
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discovery_run_id: string
          full_report: Json
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discovery_run_id?: string
          full_report?: Json
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_report_private_discovery_run_id_fkey"
            columns: ["discovery_run_id"]
            isOneToOne: true
            referencedRelation: "discovery_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_runs: {
        Row: {
          context: string | null
          created_at: string
          currency: string
          discovery_mode: string
          id: string
          payment_reference: string | null
          payment_status: string
          preview: Json
          price: number | null
          pricing_tier: string | null
          question: string
          recommendations: Json
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          currency?: string
          discovery_mode?: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          preview?: Json
          price?: number | null
          pricing_tier?: string | null
          question: string
          recommendations?: Json
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          currency?: string
          discovery_mode?: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          preview?: Json
          price?: number | null
          pricing_tier?: string | null
          question?: string
          recommendations?: Json
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      info_discovery_requests: {
        Row: {
          assessment_notes: string | null
          category: string
          context: string | null
          created_at: string
          currency: string
          id: string
          preview_text: string | null
          question: string
          quoted_amount: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_notes?: string | null
          category?: string
          context?: string | null
          created_at?: string
          currency?: string
          id?: string
          preview_text?: string | null
          question: string
          quoted_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_notes?: string | null
          category?: string
          context?: string | null
          created_at?: string
          currency?: string
          id?: string
          preview_text?: string | null
          question?: string
          quoted_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      infoservice_attachments: {
        Row: {
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          request_id: string
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          request_id: string
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          request_id?: string
          size_bytes?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "infoservice_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "infoservice_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      infoservice_requests: {
        Row: {
          assessment_notes: string | null
          category: string
          created_at: string
          currency: string
          email: string
          full_name: string
          id: string
          quoted_amount: number | null
          request_details: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_notes?: string | null
          category: string
          created_at?: string
          currency?: string
          email: string
          full_name: string
          id?: string
          quoted_amount?: number | null
          request_details: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_notes?: string | null
          category?: string
          created_at?: string
          currency?: string
          email?: string
          full_name?: string
          id?: string
          quoted_amount?: number | null
          request_details?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          description: string
          discovery_request_id: string | null
          discovery_run_id: string | null
          due_at: string | null
          id: string
          infoservice_request_id: string | null
          invoice_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description: string
          discovery_request_id?: string | null
          discovery_run_id?: string | null
          due_at?: string | null
          id?: string
          infoservice_request_id?: string | null
          invoice_number: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          discovery_request_id?: string | null
          discovery_run_id?: string | null
          due_at?: string | null
          id?: string
          infoservice_request_id?: string | null
          invoice_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_discovery_request_id_fkey"
            columns: ["discovery_request_id"]
            isOneToOne: false
            referencedRelation: "info_discovery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_discovery_run_id_fkey"
            columns: ["discovery_run_id"]
            isOneToOne: false
            referencedRelation: "discovery_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_infoservice_request_id_fkey"
            columns: ["infoservice_request_id"]
            isOneToOne: false
            referencedRelation: "infoservice_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          currency: string
          id: string
          invoice_id: string
          provider: string
          provider_reference: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_id: string
          provider?: string
          provider_reference?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string
          provider?: string
          provider_reference?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          discovery_request_id: string | null
          discovery_run_id: string | null
          id: string
          infoservice_request_id: string | null
          invoice_id: string | null
          limitations: string | null
          methodology: string | null
          released_at: string | null
          report_content: Json | null
          status: string
          storage_path: string | null
          summary: string | null
          title: string
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discovery_request_id?: string | null
          discovery_run_id?: string | null
          id?: string
          infoservice_request_id?: string | null
          invoice_id?: string | null
          limitations?: string | null
          methodology?: string | null
          released_at?: string | null
          report_content?: Json | null
          status?: string
          storage_path?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discovery_request_id?: string | null
          discovery_run_id?: string | null
          id?: string
          infoservice_request_id?: string | null
          invoice_id?: string | null
          limitations?: string | null
          methodology?: string | null
          released_at?: string | null
          report_content?: Json | null
          status?: string
          storage_path?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_discovery_request_id_fkey"
            columns: ["discovery_request_id"]
            isOneToOne: false
            referencedRelation: "info_discovery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_discovery_run_id_fkey"
            columns: ["discovery_run_id"]
            isOneToOne: false
            referencedRelation: "discovery_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_infoservice_request_id_fkey"
            columns: ["infoservice_request_id"]
            isOneToOne: false
            referencedRelation: "infoservice_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      request_activity: {
        Row: {
          activity_type: string
          actor_id: string | null
          created_at: string
          discovery_request_id: string | null
          id: string
          infoservice_request_id: string | null
          message: string
          user_id: string
          visible_to_customer: boolean
        }
        Insert: {
          activity_type: string
          actor_id?: string | null
          created_at?: string
          discovery_request_id?: string | null
          id?: string
          infoservice_request_id?: string | null
          message: string
          user_id: string
          visible_to_customer?: boolean
        }
        Update: {
          activity_type?: string
          actor_id?: string | null
          created_at?: string
          discovery_request_id?: string | null
          id?: string
          infoservice_request_id?: string | null
          message?: string
          user_id?: string
          visible_to_customer?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "request_activity_discovery_request_id_fkey"
            columns: ["discovery_request_id"]
            isOneToOne: false
            referencedRelation: "info_discovery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_activity_infoservice_request_id_fkey"
            columns: ["infoservice_request_id"]
            isOneToOne: false
            referencedRelation: "infoservice_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_manual_invoice_payment: {
        Args: { p_invoice_id: string; p_provider_reference?: string }
        Returns: undefined
      }
      has_admin_role: { Args: never; Returns: boolean }
      has_staff_role: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
