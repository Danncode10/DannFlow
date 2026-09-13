export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          is_active: boolean;
          organization_id: string;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: string;
          is_active?: boolean;
          organization_id: string;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          is_active?: boolean;
          organization_id?: string;
          start_time?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "availability_slots_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          content: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          is_published: boolean;
          organization_id: string;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          organization_id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          organization_id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          booking_date: string;
          created_at: string;
          email: string;
          id: string;
          name: string;
          organization_id: string;
          service_id: string | null;
          status: string;
        };
        Insert: {
          booking_date: string;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          organization_id?: string;
          service_id?: string | null;
          status?: string;
        };
        Update: {
          booking_date?: string;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          organization_id?: string;
          service_id?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          attendee_email: string | null;
          attendee_name: string | null;
          created_at: string;
          description: string | null;
          end_time: string;
          id: string;
          organization_id: string;
          start_time: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          attendee_email?: string | null;
          attendee_name?: string | null;
          created_at?: string;
          description?: string | null;
          end_time: string;
          id?: string;
          organization_id: string;
          start_time: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          attendee_email?: string | null;
          attendee_name?: string | null;
          created_at?: string;
          description?: string | null;
          end_time?: string;
          id?: string;
          organization_id?: string;
          start_time?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery_items: {
        Row: {
          caption: string | null;
          created_at: string;
          id: string;
          image_url: string;
          is_published: boolean;
          organization_id: string;
          service_tag: string | null;
          title: string | null;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          image_url: string;
          is_published?: boolean;
          organization_id?: string;
          service_tag?: string | null;
          title?: string | null;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string;
          is_published?: boolean;
          organization_id?: string;
          service_tag?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_items_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
          organization_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          organization_id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          organization_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          rdo_code: string | null;
          registered_address: string | null;
          taxpayer_classification: string | null;
          updated_at: string;
          vat_status: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          rdo_code?: string | null;
          registered_address?: string | null;
          taxpayer_classification?: string | null;
          updated_at?: string;
          vat_status?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          rdo_code?: string | null;
          registered_address?: string | null;
          taxpayer_classification?: string | null;
          updated_at?: string;
          vat_status?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age: number | null;
          birthday: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          is_active: boolean;
          role: Database["public"]["Enums"]["user_role"] | null;
        };
        Insert: {
          age?: number | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id: string;
          is_active?: boolean;
          role?: Database["public"]["Enums"]["user_role"] | null;
        };
        Update: {
          age?: number | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          is_active?: boolean;
          role?: Database["public"]["Enums"]["user_role"] | null;
        };
        Relationships: [];
      };
      secretary_tasks: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          organization_id: string;
          priority: string;
          status: string;
          title: string;
          triggered_by_state_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          organization_id: string;
          priority?: string;
          status?: string;
          title: string;
          triggered_by_state_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          organization_id?: string;
          priority?: string;
          status?: string;
          title?: string;
          triggered_by_state_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "secretary_tasks_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          duration_minutes: number | null;
          id: string;
          is_featured: boolean;
          is_published: boolean;
          name: string;
          organization_id: string;
          price_from: number | null;
          price_to: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          name: string;
          organization_id?: string;
          price_from?: number | null;
          price_to?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          name?: string;
          organization_id?: string;
          price_from?: number | null;
          price_to?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      team_audit_logs: {
        Row: {
          action: string;
          actor_id: string;
          created_at: string;
          id: string;
          next_values: Json | null;
          previous_values: Json | null;
          target_profile_id: string;
        };
        Insert: {
          action: string;
          actor_id: string;
          created_at?: string;
          id?: string;
          next_values?: Json | null;
          previous_values?: Json | null;
          target_profile_id: string;
        };
        Update: {
          action?: string;
          actor_id?: string;
          created_at?: string;
          id?: string;
          next_values?: Json | null;
          previous_values?: Json | null;
          target_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_audit_logs_actor_id_profiles_id_fk";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_audit_logs_target_profile_id_profiles_id_fk";
            columns: ["target_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_org_id: { Args: never; Returns: string };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      user_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const;
