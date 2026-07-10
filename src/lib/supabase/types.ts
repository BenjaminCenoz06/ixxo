/**
 * Tipos de la base de datos IXXO.
 * Equivalente a lo que genera `supabase gen types typescript`.
 * Mantener sincronizado con supabase/schema.sql.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: { id: string; slug: string; name: string; image: string | null; sort: number };
        Insert: { id?: string; slug: string; name: string; image?: string | null; sort?: number };
        Update: { id?: string; slug?: string; name?: string; image?: string | null; sort?: number };
        Relationships: [];
      };
      collections: {
        Row: { id: string; slug: string; title: string; subtitle: string | null; image: string | null };
        Insert: { id?: string; slug: string; title: string; subtitle?: string | null; image?: string | null };
        Update: { id?: string; slug?: string; title?: string; subtitle?: string | null; image?: string | null };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category_slug: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          colors: string[];
          sizes: string[];
          stock: number;
          is_new: boolean;
          collection: string | null;
          rating: number;
          review_count: number;
          description: string | null;
          materials: string[] | null;
          care: string[] | null;
          created_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          name: string;
          category_slug: string;
          price: number;
          compare_at_price?: number | null;
          images?: string[];
          colors?: string[];
          sizes?: string[];
          stock?: number;
          is_new?: boolean;
          collection?: string | null;
          rating?: number;
          review_count?: number;
          description?: string | null;
          materials?: string[] | null;
          care?: string[] | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          address: string;
          apartment: string | null;
          postal_code: string;
          province: string;
          city: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          full_name: string;
          phone: string;
          address: string;
          apartment?: string | null;
          postal_code: string;
          province: string;
          city: string;
          is_default?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; product_id: string; created_at: string };
        Insert: { user_id: string; product_id: string };
        Update: { user_id?: string; product_id?: string };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          number: string;
          user_id: string | null;
          email: string;
          status: string;
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          coupon: string | null;
          shipping_address: Json;
          created_at: string;
        };
        Insert: {
          number: string;
          user_id?: string | null;
          email: string;
          status?: string;
          subtotal: number;
          discount?: number;
          shipping?: number;
          total: number;
          coupon?: string | null;
          shipping_address?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      site_content: {
        Row: { id: string; content: Json; updated_at: string };
        Insert: { id: string; content: Json; updated_at?: string };
        Update: { id?: string; content?: Json; updated_at?: string };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          name: string;
          image: string | null;
          color: string;
          size: string;
          qty: number;
          price: number;
        };
        Insert: {
          order_id: string;
          product_id: string;
          name: string;
          image?: string | null;
          color: string;
          size: string;
          qty: number;
          price: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
