export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          created_at?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          nickname: string;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          nickname: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          nickname?: string;
          is_admin?: boolean;
        };
      };
      comments: {
        Row: {
          id: number;
          content: string;
          created_at: string;
          user_id: string;
          post_id: string;
        };
        Insert: {
          id?: number;
          content: string;
          created_at?: string;
          user_id: string;
          post_id: string;
        };
        Update: {
          id?: number;
          content?: string;
          created_at?: string;
          user_id?: string;
          post_id?: string;
        };
      };
    };
  };
} 