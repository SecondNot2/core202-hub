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
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      github_activity_cache: {
        Row: {
          activity_data: Json | null;
          current_streak: number | null;
          github_username: string;
          last_commit_date: string | null;
          last_fetched: string | null;
          today_commits: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          activity_data?: Json | null;
          current_streak?: number | null;
          github_username: string;
          last_commit_date?: string | null;
          last_fetched?: string | null;
          today_commits?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          activity_data?: Json | null;
          current_streak?: number | null;
          github_username?: string;
          last_commit_date?: string | null;
          last_fetched?: string | null;
          today_commits?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "github_activity_cache_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      hub_settings: {
        Row: {
          sidebar_collapsed: boolean | null;
          theme: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          sidebar_collapsed?: boolean | null;
          theme?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          sidebar_collapsed?: boolean | null;
          theme?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hub_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      rpg_characters: {
        Row: {
          archetype_id: string | null;
          avatar: string | null;
          energy: number | null;
          hybrid_archetype_id: string | null;
          level: number | null;
          max_energy: number | null;
          morale: number | null;
          name: string;
          stats: Json | null;
          total_xp_earned: number | null;
          updated_at: string | null;
          user_id: string;
          week_number: number | null;
          xp: number | null;
          xp_to_next_level: number | null;
        };
        Insert: {
          archetype_id?: string | null;
          avatar?: string | null;
          energy?: number | null;
          hybrid_archetype_id?: string | null;
          level?: number | null;
          max_energy?: number | null;
          morale?: number | null;
          name: string;
          stats?: Json | null;
          total_xp_earned?: number | null;
          updated_at?: string | null;
          user_id: string;
          week_number?: number | null;
          xp?: number | null;
          xp_to_next_level?: number | null;
        };
        Update: {
          archetype_id?: string | null;
          avatar?: string | null;
          energy?: number | null;
          hybrid_archetype_id?: string | null;
          level?: number | null;
          max_energy?: number | null;
          morale?: number | null;
          name?: string;
          stats?: Json | null;
          total_xp_earned?: number | null;
          updated_at?: string | null;
          user_id?: string;
          week_number?: number | null;
          xp?: number | null;
          xp_to_next_level?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_characters_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rpg_events: {
        Row: {
          data: Json | null;
          id: string;
          timestamp: string | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          data?: Json | null;
          id?: string;
          timestamp?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          data?: Json | null;
          id?: string;
          timestamp?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rpg_general_state: {
        Row: {
          boss: Json | null;
          github: Json | null;
          inventory: Json | null;
          season: Json | null;
          settings: Json | null;
          skill_tree: Json | null;
          streak: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          boss?: Json | null;
          github?: Json | null;
          inventory?: Json | null;
          season?: Json | null;
          settings?: Json | null;
          skill_tree?: Json | null;
          streak?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          boss?: Json | null;
          github?: Json | null;
          inventory?: Json | null;
          season?: Json | null;
          settings?: Json | null;
          skill_tree?: Json | null;
          streak?: Json | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_general_state_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rpg_habits: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          difficulty: number;
          effort_minutes: number;
          id: string;
          is_active: boolean | null;
          proof_mode: string;
          stat_affinity: string | null;
          time_window: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          difficulty?: number;
          effort_minutes: number;
          id?: string;
          is_active?: boolean | null;
          proof_mode?: string;
          stat_affinity?: string | null;
          time_window: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          difficulty?: number;
          effort_minutes?: number;
          id?: string;
          is_active?: boolean | null;
          proof_mode?: string;
          stat_affinity?: string | null;
          time_window?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rpg_quests: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          date: string;
          difficulty: number;
          effort_minutes: number;
          gold_reward: number;
          habit_id: string;
          id: string;
          proof_content: string | null;
          quest_type: string;
          status: string;
          user_id: string;
          xp_reward: number;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          date: string;
          difficulty: number;
          effort_minutes: number;
          gold_reward: number;
          habit_id: string;
          id?: string;
          proof_content?: string | null;
          quest_type: string;
          status: string;
          user_id: string;
          xp_reward: number;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          date?: string;
          difficulty?: number;
          effort_minutes?: number;
          gold_reward?: number;
          habit_id?: string;
          id?: string;
          proof_content?: string | null;
          quest_type?: string;
          status?: string;
          user_id?: string;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_quests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rpg_snapshots: {
        Row: {
          created_at: string | null;
          date: string;
          gold_earned: number | null;
          id: string;
          level: number | null;
          quests_completed: number | null;
          quests_total: number | null;
          streak: number | null;
          user_id: string | null;
          xp: number | null;
          xp_earned: number | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          gold_earned?: number | null;
          id?: string;
          level?: number | null;
          quests_completed?: number | null;
          quests_total?: number | null;
          streak?: number | null;
          user_id?: string | null;
          xp?: number | null;
          xp_earned?: number | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          gold_earned?: number | null;
          id?: string;
          level?: number | null;
          quests_completed?: number | null;
          quests_total?: number | null;
          streak?: number | null;
          user_id?: string | null;
          xp?: number | null;
          xp_earned?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_snapshots_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

// Exclude internal Supabase metadata from schema lookups
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
