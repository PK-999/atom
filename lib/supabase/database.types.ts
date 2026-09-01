export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
      corrections: {
        Row: {
          corrected_dataset_version_id: string;
          created_at: string;
          decided_on: string;
          id: string;
          material_impact: string;
          observation_id: string;
          previous_dataset_version_id: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          reason: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          corrected_dataset_version_id: string;
          created_at?: string;
          decided_on: string;
          id: string;
          material_impact: string;
          observation_id: string;
          previous_dataset_version_id: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reason: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          corrected_dataset_version_id?: string;
          created_at?: string;
          decided_on?: string;
          id?: string;
          material_impact?: string;
          observation_id?: string;
          previous_dataset_version_id?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reason?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "corrections_corrected_dataset_version_id_fkey";
            columns: ["corrected_dataset_version_id"];
            isOneToOne: false;
            referencedRelation: "dataset_versions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "corrections_observation_id_fkey";
            columns: ["observation_id"];
            isOneToOne: false;
            referencedRelation: "observations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "corrections_previous_dataset_version_id_fkey";
            columns: ["previous_dataset_version_id"];
            isOneToOne: false;
            referencedRelation: "dataset_versions";
            referencedColumns: ["id"];
          },
        ];
      };
      dataset_versions: {
        Row: {
          acquired_on: string;
          checksum_algorithm: string;
          checksum_digest: string;
          created_at: string;
          dataset_id: string;
          id: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          supersedes_version_id: string | null;
          transformation_version: string;
        };
        Insert: {
          acquired_on: string;
          checksum_algorithm: string;
          checksum_digest: string;
          created_at?: string;
          dataset_id: string;
          id: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          supersedes_version_id?: string | null;
          transformation_version: string;
        };
        Update: {
          acquired_on?: string;
          checksum_algorithm?: string;
          checksum_digest?: string;
          created_at?: string;
          dataset_id?: string;
          id?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          supersedes_version_id?: string | null;
          transformation_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dataset_versions_dataset_id_fkey";
            columns: ["dataset_id"];
            isOneToOne: false;
            referencedRelation: "datasets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dataset_versions_supersedes_version_id_fkey";
            columns: ["supersedes_version_id"];
            isOneToOne: false;
            referencedRelation: "dataset_versions";
            referencedColumns: ["id"];
          },
        ];
      };
      datasets: {
        Row: {
          created_at: string;
          id: string;
          licence_name: string;
          licence_url: string | null;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          publisher: string;
          raw_access: Database["public"]["Enums"]["raw_access_status"];
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at: string | null;
          reviewed_by: string | null;
          source_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          licence_name: string;
          licence_url?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          publisher: string;
          raw_access: Database["public"]["Enums"]["raw_access_status"];
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          licence_name?: string;
          licence_url?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          publisher?: string;
          raw_access?: Database["public"]["Enums"]["raw_access_status"];
          redistribution?: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "datasets_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      geographies: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          parent_geography_id: string | null;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          scope: Database["public"]["Enums"]["geography_scope"];
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          parent_geography_id?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          scope: Database["public"]["Enums"]["geography_scope"];
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          parent_geography_id?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          scope?: Database["public"]["Enums"]["geography_scope"];
        };
        Relationships: [
          {
            foreignKeyName: "geographies_parent_geography_id_fkey";
            columns: ["parent_geography_id"];
            isOneToOne: false;
            referencedRelation: "geographies";
            referencedColumns: ["id"];
          },
        ];
      };
      metric_releases: {
        Row: {
          active_dataset_version_id: string | null;
          availability_status: Database["public"]["Enums"]["availability_status"];
          created_at: string;
          feature_enabled: boolean;
          geography_ids: string[];
          message: string;
          metric_id: string;
          period_end_year: number | null;
          period_start_year: number | null;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          range_mode: Database["public"]["Enums"]["availability_mode"];
          raw_mode: Database["public"]["Enums"]["availability_mode"];
          redistribution_decision: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at: string | null;
          reviewed_by: string | null;
          technology_ids: string[];
          typical_mode: Database["public"]["Enums"]["availability_mode"];
          updated_at: string;
        };
        Insert: {
          active_dataset_version_id?: string | null;
          availability_status: Database["public"]["Enums"]["availability_status"];
          created_at?: string;
          feature_enabled?: boolean;
          geography_ids?: string[];
          message: string;
          metric_id: string;
          period_end_year?: number | null;
          period_start_year?: number | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_mode?: Database["public"]["Enums"]["availability_mode"];
          raw_mode?: Database["public"]["Enums"]["availability_mode"];
          redistribution_decision: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          technology_ids?: string[];
          typical_mode?: Database["public"]["Enums"]["availability_mode"];
          updated_at?: string;
        };
        Update: {
          active_dataset_version_id?: string | null;
          availability_status?: Database["public"]["Enums"]["availability_status"];
          created_at?: string;
          feature_enabled?: boolean;
          geography_ids?: string[];
          message?: string;
          metric_id?: string;
          period_end_year?: number | null;
          period_start_year?: number | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_mode?: Database["public"]["Enums"]["availability_mode"];
          raw_mode?: Database["public"]["Enums"]["availability_mode"];
          redistribution_decision?: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          technology_ids?: string[];
          typical_mode?: Database["public"]["Enums"]["availability_mode"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "metric_releases_active_dataset_version_id_fkey";
            columns: ["active_dataset_version_id"];
            isOneToOne: false;
            referencedRelation: "dataset_versions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "metric_releases_metric_id_fkey";
            columns: ["metric_id"];
            isOneToOne: true;
            referencedRelation: "metrics";
            referencedColumns: ["id"];
          },
        ];
      };
      metrics: {
        Row: {
          canonical_unit: string | null;
          created_at: string;
          definition: string;
          explanation_content: string;
          geography_support: Database["public"]["Enums"]["geography_scope"][];
          id: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          range_semantics: string;
          registry_category: string;
          representative_rule: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          supported_units: string[] | null;
          value_kind: Database["public"]["Enums"]["value_kind"];
        };
        Insert: {
          canonical_unit?: string | null;
          created_at?: string;
          definition: string;
          explanation_content: string;
          geography_support: Database["public"]["Enums"]["geography_scope"][];
          id: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_semantics: string;
          registry_category: string;
          representative_rule: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          supported_units?: string[] | null;
          value_kind: Database["public"]["Enums"]["value_kind"];
        };
        Update: {
          canonical_unit?: string | null;
          created_at?: string;
          definition?: string;
          explanation_content?: string;
          geography_support?: Database["public"]["Enums"]["geography_scope"][];
          id?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_semantics?: string;
          registry_category?: string;
          representative_rule?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          supported_units?: string[] | null;
          value_kind?: Database["public"]["Enums"]["value_kind"];
        };
        Relationships: [];
      };
      observation_transformations: {
        Row: {
          created_at: string;
          explanatory_note: string;
          id: string;
          input_unit: string | null;
          observation_id: string;
          operation_name: string;
          output_unit: string | null;
          parameters: Json;
          software_version: string;
          step_order: number;
        };
        Insert: {
          created_at?: string;
          explanatory_note: string;
          id: string;
          input_unit?: string | null;
          observation_id: string;
          operation_name: string;
          output_unit?: string | null;
          parameters?: Json;
          software_version: string;
          step_order: number;
        };
        Update: {
          created_at?: string;
          explanatory_note?: string;
          id?: string;
          input_unit?: string | null;
          observation_id?: string;
          operation_name?: string;
          output_unit?: string | null;
          parameters?: Json;
          software_version?: string;
          step_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "observation_transformations_observation_id_fkey";
            columns: ["observation_id"];
            isOneToOne: false;
            referencedRelation: "observations";
            referencedColumns: ["id"];
          },
        ];
      };
      observations: {
        Row: {
          category_definition: string | null;
          category_value: string | null;
          created_at: string;
          dataset_version_id: string;
          geography_id: string;
          id: string;
          interval_level: number | null;
          last_verified_on: string;
          lower_value: number | null;
          methodology: string;
          metric_id: string;
          period_end_year: number;
          period_start_year: number;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          range_kind: Database["public"]["Enums"]["range_kind"] | null;
          raw_access: Database["public"]["Enums"]["raw_access_status"];
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          representative_kind: string;
          representative_value: number | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          source_id: string;
          source_range_label: string | null;
          study_id: string;
          system_boundary: string;
          technology_id: string;
          uncertainty: string;
          unit: string | null;
          upper_value: number | null;
          value: number | null;
          value_kind: Database["public"]["Enums"]["value_kind"];
          value_semantics: string;
        };
        Insert: {
          category_definition?: string | null;
          category_value?: string | null;
          created_at?: string;
          dataset_version_id: string;
          geography_id: string;
          id: string;
          interval_level?: number | null;
          last_verified_on: string;
          lower_value?: number | null;
          methodology: string;
          metric_id: string;
          period_end_year: number;
          period_start_year: number;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_kind?: Database["public"]["Enums"]["range_kind"] | null;
          raw_access: Database["public"]["Enums"]["raw_access_status"];
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          representative_kind: string;
          representative_value?: number | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id: string;
          source_range_label?: string | null;
          study_id: string;
          system_boundary: string;
          technology_id: string;
          uncertainty: string;
          unit?: string | null;
          upper_value?: number | null;
          value?: number | null;
          value_kind: Database["public"]["Enums"]["value_kind"];
          value_semantics: string;
        };
        Update: {
          category_definition?: string | null;
          category_value?: string | null;
          created_at?: string;
          dataset_version_id?: string;
          geography_id?: string;
          id?: string;
          interval_level?: number | null;
          last_verified_on?: string;
          lower_value?: number | null;
          methodology?: string;
          metric_id?: string;
          period_end_year?: number;
          period_start_year?: number;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          range_kind?: Database["public"]["Enums"]["range_kind"] | null;
          raw_access?: Database["public"]["Enums"]["raw_access_status"];
          redistribution?: Database["public"]["Enums"]["redistribution_status"];
          representative_kind?: string;
          representative_value?: number | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id?: string;
          source_range_label?: string | null;
          study_id?: string;
          system_boundary?: string;
          technology_id?: string;
          uncertainty?: string;
          unit?: string | null;
          upper_value?: number | null;
          value?: number | null;
          value_kind?: Database["public"]["Enums"]["value_kind"];
          value_semantics?: string;
        };
        Relationships: [
          {
            foreignKeyName: "observations_dataset_version_id_fkey";
            columns: ["dataset_version_id"];
            isOneToOne: false;
            referencedRelation: "dataset_versions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "observations_geography_id_fkey";
            columns: ["geography_id"];
            isOneToOne: false;
            referencedRelation: "geographies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "observations_metric_id_fkey";
            columns: ["metric_id"];
            isOneToOne: false;
            referencedRelation: "metrics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "observations_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "observations_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "studies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "observations_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          },
        ];
      };
      sources: {
        Row: {
          accessed_on: string;
          conflict_disclosure: string;
          created_at: string;
          id: string;
          last_verified_on: string;
          licence_name: string;
          licence_url: string | null;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          published_on: string;
          publisher: string;
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at: string | null;
          reviewed_by: string | null;
          source_identifier: string | null;
          source_tier: Database["public"]["Enums"]["source_tier"];
          title: string;
          url: string;
        };
        Insert: {
          accessed_on: string;
          conflict_disclosure: string;
          created_at?: string;
          id: string;
          last_verified_on: string;
          licence_name: string;
          licence_url?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          published_on: string;
          publisher: string;
          redistribution: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_identifier?: string | null;
          source_tier: Database["public"]["Enums"]["source_tier"];
          title: string;
          url: string;
        };
        Update: {
          accessed_on?: string;
          conflict_disclosure?: string;
          created_at?: string;
          id?: string;
          last_verified_on?: string;
          licence_name?: string;
          licence_url?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          published_on?: string;
          publisher?: string;
          redistribution?: Database["public"]["Enums"]["redistribution_status"];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_identifier?: string | null;
          source_tier?: Database["public"]["Enums"]["source_tier"];
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      studies: {
        Row: {
          created_at: string;
          id: string;
          methodology: string;
          period_end_year: number;
          period_start_year: number;
          publication_label: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          source_id: string;
          system_boundary: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          methodology: string;
          period_end_year: number;
          period_start_year: number;
          publication_label: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id: string;
          system_boundary: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          methodology?: string;
          period_end_year?: number;
          period_start_year?: number;
          publication_label?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_id?: string;
          system_boundary?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "studies_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      technologies: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          lifecycle_status: string;
          name: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          variant: string | null;
        };
        Insert: {
          created_at?: string;
          description: string;
          id: string;
          lifecycle_status: string;
          name: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          variant?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          lifecycle_status?: string;
          name?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          variant?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      availability_mode: "available" | "unavailable" | "restricted";
      availability_status:
        | "unreviewed"
        | "supported"
        | "partial"
        | "incompatible"
        | "unavailable"
        | "restricted"
        | "stale"
        | "disputed";
      geography_scope: "global" | "country" | "region" | "grid" | "facility";
      ingestion_status: "pending" | "running" | "succeeded" | "failed";
      publication_status: "draft" | "in-review" | "published" | "withdrawn";
      range_kind:
        | "min-max"
        | "confidence"
        | "credible"
        | "interquartile"
        | "prediction"
        | "source-defined";
      raw_access_status: "permitted" | "restricted" | "unavailable";
      redistribution_status: "allowed" | "restricted" | "unknown";
      source_tier: "A" | "B" | "C";
      value_kind: "numeric" | "categorical";
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
      availability_mode: ["available", "unavailable", "restricted"],
      availability_status: [
        "unreviewed",
        "supported",
        "partial",
        "incompatible",
        "unavailable",
        "restricted",
        "stale",
        "disputed",
      ],
      geography_scope: ["global", "country", "region", "grid", "facility"],
      ingestion_status: ["pending", "running", "succeeded", "failed"],
      publication_status: ["draft", "in-review", "published", "withdrawn"],
      range_kind: [
        "min-max",
        "confidence",
        "credible",
        "interquartile",
        "prediction",
        "source-defined",
      ],
      raw_access_status: ["permitted", "restricted", "unavailable"],
      redistribution_status: ["allowed", "restricted", "unknown"],
      source_tier: ["A", "B", "C"],
      value_kind: ["numeric", "categorical"],
    },
  },
} as const;
