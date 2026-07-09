import "server-only";
import type { Product } from "@/types";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  products as mockProducts,
  getProduct as mockGetProduct,
  productsByCategory as mockByCategory,
  newArrivals as mockNew,
  relatedTo as mockRelated,
} from "@/data/products";
import { categories } from "@/data/categories";

type Row = Database["public"]["Tables"]["products"]["Row"];

const nameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

/** Convierte una fila de la DB al tipo de dominio Product. */
function toProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: nameBySlug.get(row.category_slug) ?? row.category_slug,
    categorySlug: row.category_slug,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    images: (row.images.length >= 2
      ? row.images
      : [row.images[0] ?? "", row.images[0] ?? ""]) as Product["images"],
    colors: row.colors,
    sizes: row.sizes,
    stock: row.stock,
    isNew: row.is_new,
    collection: row.collection ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    description: row.description ?? undefined,
    materials: row.materials ?? undefined,
    care: row.care ?? undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockProducts;
  const { data, error } = await supabase.from("products").select("*").order("created_at");
  if (error || !data?.length) return mockProducts;
  return data.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockGetProduct(slug);
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return mockGetProduct(slug);
  return toProduct(data);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockByCategory(categorySlug);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug);
  if (error || !data) return mockByCategory(categorySlug);
  return data.map(toProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockNew;
  const { data, error } = await supabase.from("products").select("*").eq("is_new", true);
  if (error || !data?.length) return mockNew;
  return data.map(toProduct);
}

export async function getOnSale(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.compareAtPrice);
}

export async function getFeatured(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.slice(0, 8);
}

export async function getRelated(product: Product, count = 4): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockRelated(product, count);
  const all = await getAllProducts();
  const same = all.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id);
  const others = all.filter((p) => p.categorySlug !== product.categorySlug && p.id !== product.id);
  return [...same, ...others].slice(0, count);
}

/** Slugs para generateStaticParams — siempre desde mock para el build estático. */
export function allProductSlugs(): string[] {
  return mockProducts.map((p) => p.slug);
}
