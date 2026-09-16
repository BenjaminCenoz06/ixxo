import "server-only";
import { unstable_cache } from "next/cache";
import type { Category, Collection } from "@/types";
import { getSupabasePublic } from "@/lib/supabase/server";
import { categories as mockCategories } from "@/data/categories";
import { collections as mockCollections } from "@/data/collections";
import { TAG_CATALOG, CACHE_TTL_SECONDS } from "@/lib/cache";

/**
 * Categorías con su conteo de productos, cacheadas bajo `catalog`.
 * El conteo obliga a leer una fila por producto, así que sin caché esta
 * consulta sola duplicaba el tráfico del catálogo en cada visita.
 */
const readCategoriesFromSupabase = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = getSupabasePublic();
    if (!supabase) return [];

    const [cats, prods] = await Promise.all([
      supabase.from("categories").select("*").order("sort"),
      supabase.from("products").select("category_slug"),
    ]);
    if (cats.error) throw new Error(cats.error.message);
    if (!cats.data?.length) return [];

    const counts = new Map<string, number>();
    for (const p of prods.data ?? [])
      counts.set(p.category_slug, (counts.get(p.category_slug) ?? 0) + 1);

    return cats.data.map((c) => ({
      name: c.name,
      slug: c.slug,
      image: c.image ?? "",
      count: counts.get(c.slug) ?? 0,
    }));
  },
  ["catalogo-categorias"],
  { tags: [TAG_CATALOG], revalidate: CACHE_TTL_SECONDS },
);

/** Categorías desde la DB (con conteo de productos); cae a mock. */
export async function getCategories(): Promise<Category[]> {
  try {
    const fromDb = await readCategoriesFromSupabase();
    if (fromDb.length > 0) return fromDb;
  } catch (err) {
    console.warn("[categorias] Supabase no respondió; se usan las del código.", err);
  }
  return mockCategories;
}

/** Subconjunto destacado para el mosaico del home. */
export async function getFeaturedCategories(limit = 6): Promise<Category[]> {
  const all = await getCategories();
  return all.slice(0, limit);
}

/** Colecciones desde la DB, cacheadas bajo `catalog`. */
const readCollectionsFromSupabase = unstable_cache(
  async (): Promise<Collection[]> => {
    const supabase = getSupabasePublic();
    if (!supabase) return [];

    const { data, error } = await supabase.from("collections").select("*");
    if (error) throw new Error(error.message);

    return (data ?? []).map((c, i) => ({
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle ?? "",
      image: c.image ?? "",
      align: i % 2 === 1 ? "right" : "left",
    }));
  },
  ["catalogo-colecciones"],
  { tags: [TAG_CATALOG], revalidate: CACHE_TTL_SECONDS },
);

/** Colecciones desde la DB; cae a mock. */
export async function getCollections(): Promise<Collection[]> {
  try {
    const fromDb = await readCollectionsFromSupabase();
    if (fromDb.length > 0) return fromDb;
  } catch (err) {
    console.warn("[colecciones] Supabase no respondió; se usan las del código.", err);
  }
  return mockCollections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug);
}
