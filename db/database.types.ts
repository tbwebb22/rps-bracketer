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
      games: {
        Row: {
          completed: boolean | null
          current_round: number | null
          id: number
          registration_end_date: string | null
          registration_start_date: string
        }
        Insert: {
          completed?: boolean | null
          current_round?: number | null
          id?: number
          registration_end_date?: string | null
          registration_start_date: string
        }
        Update: {
          completed?: boolean | null
          current_round?: number | null
          id?: number
          registration_end_date?: string | null
          registration_start_date?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          game_id: number | null
          id: number
          player1_id: number | null
          player1_move: number | null
          player2_id: number | null
          player2_move: number | null
          round_id: number
          winner_id: number | null
        }
        Insert: {
          game_id?: number | null
          id?: number
          player1_id?: number | null
          player1_move?: number | null
          player2_id?: number | null
          player2_move?: number | null
          round_id: number
          winner_id?: number | null
        }
        Update: {
          game_id?: number | null
          id?: number
          player1_id?: number | null
          player1_move?: number | null
          player2_id?: number | null
          player2_move?: number | null
          round_id?: number
          winner_id?: number | null
        }
        Relationships: []
      }
      rounds: {
        Row: {
          end_time: string | null
          game_id: number
          id: number
          round_number: number | null
          start_time: string | null
        }
        Insert: {
          end_time?: string | null
          game_id: number
          id?: number
          round_number?: number | null
          start_time?: string | null
        }
        Update: {
          end_time?: string | null
          game_id?: number
          id?: number
          round_number?: number | null
          start_time?: string | null
        }
        Relationships: []
      }
      user_registration: {
        Row: {
          game_id: number
          id: number
          registered_at: string | null
          user_id: number | null
        }
        Insert: {
          game_id: number
          id?: number
          registered_at?: string | null
          user_id?: number | null
        }
        Update: {
          game_id?: number
          id?: number
          registered_at?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          fid: number | null
          id: number
        }
        Insert: {
          created_at?: string
          fid?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          fid?: number | null
          id?: number
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
