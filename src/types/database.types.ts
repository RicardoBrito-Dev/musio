export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'fan' | 'artist' | 'admin';
export type ReleaseType = 'single' | 'ep' | 'album';
export type ProductType = 'single' | 'album' | 'stem' | 'sample_pack' | 'exclusive' | 'merch';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'pix' | 'credit_card' | 'wallet' | 'mock';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'rejected';
export type ContentType = 'audio' | 'video' | 'stems' | 'post' | 'download';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          username: string | null;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          username?: string | null;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          username?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          stage_name: string;
          bio: string | null;
          banner_url: string | null;
          avatar_url: string | null;
          verified: boolean;
          social_links: Record<string, string>;
          pix_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          stage_name: string;
          bio?: string | null;
          banner_url?: string | null;
          avatar_url?: string | null;
          verified?: boolean;
          social_links?: Record<string, string>;
          pix_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          stage_name?: string;
          bio?: string | null;
          banner_url?: string | null;
          avatar_url?: string | null;
          verified?: boolean;
          social_links?: Record<string, string>;
          pix_key?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tracks: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          slug: string;
          audio_url: string;
          cover_url: string | null;
          duration_seconds: number;
          is_exclusive: boolean;
          price_cents: number;
          lyrics: string | null;
          bpm: number | null;
          musical_key: string | null;
          play_count: number;
          like_count: number;
          copyright_declaration: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          slug: string;
          audio_url: string;
          cover_url?: string | null;
          duration_seconds?: number;
          is_exclusive?: boolean;
          price_cents?: number;
          lyrics?: string | null;
          bpm?: number | null;
          musical_key?: string | null;
          play_count?: number;
          like_count?: number;
          copyright_declaration?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          audio_url?: string;
          cover_url?: string | null;
          duration_seconds?: number;
          is_exclusive?: boolean;
          price_cents?: number;
          lyrics?: string | null;
          bpm?: number | null;
          musical_key?: string | null;
          play_count?: number;
          like_count?: number;
          copyright_declaration?: boolean;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      albums: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          slug: string;
          release_type: ReleaseType;
          cover_url: string | null;
          description: string | null;
          release_date: string;
          price_cents: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          slug: string;
          release_type?: ReleaseType;
          cover_url?: string | null;
          description?: string | null;
          release_date?: string;
          price_cents?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          release_type?: ReleaseType;
          cover_url?: string | null;
          description?: string | null;
          release_date?: string;
          price_cents?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      album_tracks: {
        Row: {
          id: string;
          album_id: string;
          track_id: string;
          track_number: number;
        };
        Insert: {
          id?: string;
          album_id: string;
          track_id: string;
          track_number?: number;
        };
        Update: {
          album_id?: string;
          track_id?: string;
          track_number?: number;
        };
        Relationships: [];
      };
      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          color?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          artist_id: string;
          status: OrderStatus;
          total_cents: number;
          platform_fee_cents: number;
          artist_net_cents: number;
          support_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artist_id: string;
          status?: OrderStatus;
          total_cents: number;
          platform_fee_cents?: number;
          artist_net_cents?: number;
          support_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          total_cents?: number;
          platform_fee_cents?: number;
          artist_net_cents?: number;
          support_message?: string | null;
          updated_at?: string;
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
      user_role: UserRole;
      release_type: ReleaseType;
      product_type: ProductType;
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payout_status: PayoutStatus;
      content_type: ContentType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
