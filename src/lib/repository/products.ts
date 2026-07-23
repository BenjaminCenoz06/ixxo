import "server-only";
import type { Product } from "@/types";
import type { Database } from "@/lib/supabase/types";
import { getSupabasePublic } from "@/lib/supabase/server";
import { fetchGoogleSheetsProducts } from "@/lib/services/google-sheets";
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

/** Convierte una fila de la DB de Supabase al tipo de dominio Product. */
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

/**
 * Obtiene todos los productos de la tienda.
 * Prioridad de fuentes de datos:
 * 1. API de Google Sheets
 * 2. Supabase (si está configurado)
 * 3. Productos de respaldo (mock)
 */
export async function getAllProducts(): Promise<Product[]> {
  // 1. Intentar obtener desde Google Sheets API
  const { products: sheetProducts, error: sheetError } = await fetchGoogleSheetsProducts();
  if (!sheetError && sheetProducts.length > 0) {
    return sheetProducts;
  }

  // 2. Si Google Sheets no retorna datos, intentar Supabase
  const supabase = await getSupabasePublic();
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("created_at");
    if (!error && data?.length) {
      return data.map(toProduct);
    }
  }

  // 3. Fallback a datos mock locales
  return mockProducts;
}

/**
 * Obtiene un producto individual por su slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  const found = all.find((p) => p.slug === slug);
  if (found) return found;

  // Fallback si no se encontró en la lista general
  return mockGetProduct(slug);
}

/**
 * Obtiene productos filtrados por el slug de su categoría.
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const all = await getAllProducts();
  const filtered = all.filter((p) => p.categorySlug === categorySlug);
  if (filtered.length > 0) return filtered;

  return mockByCategory(categorySlug);
}

/**
 * Obtiene las novedades (productos marcados como isNew).
 */
export async function getNewArrivals(): Promise<Product[]> {
  const all = await getAllProducts();
  const news = all.filter((p) => p.isNew);
  if (news.length > 0) return news;

  return mockNew;
}

/**
 * Obtiene los productos que están en oferta (con compareAtPrice).
 */
export async function getOnSale(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

/**
 * Obtiene los productos destacados para la página principal.
 */
export async function getFeatured(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.slice(0, 8);
}

/**
 * Obtiene productos relacionados a un producto dado.
 */
export async function getRelated(product: Product, count = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const same = all.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id);
  const others = all.filter((p) => p.categorySlug !== product.categorySlug && p.id !== product.id);
  const combined = [...same, ...others];
  if (combined.length > 0) return combined.slice(0, count);

  return mockRelated(product, count);
}

/**
 * Retorna todos los slugs para generateStaticParams.
 */
export function allProductSlugs(): string[] {
  return mockProducts.map((p) => p.slug);
}
