export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
          energy: number | null;
          level: number | null;
          max_energy: number | null;
          morale: number | null;
          name: string | null;
          stats: Json | null;
          updated_at: string | null;
          user_id: string;
          xp: number | null;
          xp_to_next_level: number | null;
        };
        Insert: {
          archetype_id?: string | null;
          energy?: number | null;
          level?: number | null;
          max_energy?: number | null;
          morale?: number | null;
          name?: string | null;
          stats?: Json | null;
          updated_at?: string | null;
          user_id: string;
          xp?: number | null;
          xp_to_next_level?: number | null;
        };
        Update: {
          archetype_id?: string | null;
          energy?: number | null;
          level?: number | null;
          max_energy?: number | null;
          morale?: number | null;
          name?: string | null;
          stats?: Json | null;
          updated_at?: string | null;
          user_id?: string;
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
          type: string;
          user_id: string;
        };
        Insert: {
          data?: Json | null;
          id?: string;
          timestamp?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          data?: Json | null;
          id?: string;
          timestamp?: string | null;
          type?: string;
          user_id?: string;
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
          boss_state: Json | null;
          game_settings: Json | null;
          inventory: Json | null;
          season_state: Json | null;
          skill_tree: Json | null;
          streak: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          boss_state?: Json | null;
          game_settings?: Json | null;
          inventory?: Json | null;
          season_state?: Json | null;
          skill_tree?: Json | null;
          streak?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          boss_state?: Json | null;
          game_settings?: Json | null;
          inventory?: Json | null;
          season_state?: Json | null;
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
          category: string | null;
          created_at: string | null;
          description: string | null;
          difficulty: number | null;
          effort_minutes: number | null;
          id: string;
          is_active: boolean | null;
          proof_mode: string | null;
          stat_affinity: string | null;
          time_window: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty?: number | null;
          effort_minutes?: number | null;
          id?: string;
          is_active?: boolean | null;
          proof_mode?: string | null;
          stat_affinity?: string | null;
          time_window?: string | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty?: number | null;
          effort_minutes?: number | null;
          id?: string;
          is_active?: boolean | null;
          proof_mode?: string | null;
          stat_affinity?: string | null;
          time_window?: string | null;
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
          difficulty: number | null;
          effort_minutes: number | null;
          gold_reward: number | null;
          habit_id: string | null;
          id: string;
          proof_content: string | null;
          quest_type: string | null;
          status: string | null;
          user_id: string;
          xp_reward: number | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          date: string;
          difficulty?: number | null;
          effort_minutes?: number | null;
          gold_reward?: number | null;
          habit_id?: string | null;
          id?: string;
          proof_content?: string | null;
          quest_type?: string | null;
          status?: string | null;
          user_id: string;
          xp_reward?: number | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          date?: string;
          difficulty?: number | null;
          effort_minutes?: number | null;
          gold_reward?: number | null;
          habit_id?: string | null;
          id?: string;
          proof_content?: string | null;
          quest_type?: string | null;
          status?: string | null;
          user_id?: string;
          xp_reward?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "rpg_quests_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "rpg_habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rpg_quests_user_id_fkey";
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
