Need to install the following packages:
supabase@2.22.12
Ok to proceed? (y) 

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'user';

export interface UserMetadata {
  role?: UserRole;
  nickname?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nickname: string;
          created_at: string;
          role: UserRole;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          email: string;
          nickname: string;
          created_at?: string;
          role?: UserRole;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string;
          created_at?: string;
          role?: UserRole;
          is_admin?: boolean;
        };
      };
      // ... existing code ...
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
  };
} 
