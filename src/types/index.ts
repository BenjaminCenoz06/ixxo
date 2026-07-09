export type BadgeKind = "new" | "sale" | "low-stock";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  images: [string, string, ...string[]];
  /** Nombres de color (ver data/colors.ts). */
  colors: string[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  collection?: string;
  rating: number;
  reviewCount: number;
  description?: string;
  materials?: string[];
  care?: string[];
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  align?: "left" | "right";
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  product: string;
  avatar: string;
}
