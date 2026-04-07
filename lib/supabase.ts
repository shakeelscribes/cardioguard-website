// lib/supabase.ts - Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          gender: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          phone?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          risk_score: number;
          risk_level: string;
          age: number;
          gender: number;
          height: number;
          weight: number;
          ap_hi: number;
          ap_lo: number;
          cholesterol: number;
          gluc: number;
          smoke: number;
          alco: number;
          active: number;
        };
        Insert: {
          user_id: string;
          risk_score: number;
          risk_level: string;
          age: number;
          gender: number;
          height: number;
          weight: number;
          ap_hi: number;
          ap_lo: number;
          cholesterol: number;
          gluc: number;
          smoke: number;
          alco: number;
          active: number;
        };
      };
    };
  };
};
