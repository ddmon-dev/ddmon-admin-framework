export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          deleted: boolean
          email: string
          id: string
          name: string
          password: string
          super_admin: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          email: string
          id: string
          name: string
          password: string
          super_admin?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          email?: string
          id?: string
          name?: string
          password?: string
          super_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          author: string | null
          author_id: string | null
          category: string
          created_at: string
          deleted: boolean
          id: string
          question: string
          sort_order: number
          updated_at: string
          updated_by: string | null
          updated_by_id: string | null
        }
        Insert: {
          answer: string
          author?: string | null
          author_id?: string | null
          category?: string
          created_at?: string
          deleted?: boolean
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
        }
        Update: {
          answer?: string
          author?: string | null
          author_id?: string | null
          category?: string
          created_at?: string
          deleted?: boolean
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          company: string | null
          content: string
          created_at: string
          deleted: boolean
          email: string
          id: string
          name: string
          phone: string | null
          position: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string
          deleted?: boolean
          email: string
          id?: string
          name: string
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          deleted?: boolean
          email?: string
          id?: string
          name?: string
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiry_replies: {
        Row: {
          author: string
          author_id: string | null
          content: string
          created_at: string
          id: string
          inquiry_id: string
          sent_at: string | null
          updated_at: string
        }
        Insert: {
          author: string
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          inquiry_id: string
          sent_at?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          sent_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiry_replies_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          author_id: string | null
          content: string | null
          created_at: string
          deleted: boolean
          files: Json | null
          id: string
          title: string
          updated_at: string
          updated_by: string | null
          updated_by_id: string | null
          view_count: number
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          content?: string | null
          created_at?: string
          deleted?: boolean
          files?: Json | null
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          view_count?: number
        }
        Update: {
          author?: string | null
          author_id?: string | null
          content?: string | null
          created_at?: string
          deleted?: boolean
          files?: Json | null
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          author: string
          author_id: string | null
          category: string
          content: string | null
          created_at: string
          deleted: boolean
          files: Json | null
          id: string
          title: string
          updated_at: string
          updated_by: string | null
          updated_by_id: string | null
          view_count: number
        }
        Insert: {
          author: string
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          deleted?: boolean
          files?: Json | null
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          view_count?: number
        }
        Update: {
          author?: string
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          deleted?: boolean
          files?: Json | null
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "notices_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      popups: {
        Row: {
          author: string | null
          author_id: string | null
          content: string
          created_at: string
          deleted: boolean
          end_date: string | null
          id: string
          is_active: boolean
          is_always: boolean
          position_left: number
          position_top: number
          start_date: string | null
          title: string
          updated_at: string
          updated_by: string | null
          updated_by_id: string | null
          width: number
          z_index: number
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          content: string
          created_at?: string
          deleted?: boolean
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_always?: boolean
          position_left?: number
          position_top?: number
          start_date?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          width?: number
          z_index?: number
        }
        Update: {
          author?: string | null
          author_id?: string | null
          content?: string
          created_at?: string
          deleted?: boolean
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_always?: boolean
          position_left?: number
          position_top?: number
          start_date?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          updated_by_id?: string | null
          width?: number
          z_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "popups_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popups_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { row_id: string; table_name: string }
        Returns: undefined
      }
      swap_sort_order: {
        Args: {
          p_id1: string
          p_id2: string
          p_order1: number
          p_order2: number
          p_table_name: string
        }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
