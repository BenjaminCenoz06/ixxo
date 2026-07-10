import "server-only";
import type { Category, Collection } from "@/types";
import { getSupabasePublic } from "@/lib/supabase/server";
import { categories as mockCategories } from "@/data/categories";
import { collections as mockCollections } from "@/data/collections";

/** Categorías desde la DB (con conteo de productos); cae a mock. */
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return mockCategories;

  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from("categories").select("*").order("sort"),
    supabase.from("products").select("category_slug"),
  ]);
  if (!cats?.length) return mockCategories;

  const counts = new Map<string, number>();
  for (const p of prods ?? []) counts.set(p.category_slug, (counts.get(p.category_slug) ?? 0) + 1);

  return cats.map((c) => ({
    name: c.name,
    slug: c.slug,
    image: c.image ?? "",
    count: counts.get(c.slug) ?? 0,
  }));
}

/** Subconjunto destacado para el mosaico del home. */
export async function getFeaturedCategories(limit = 6): Promise<Category[]> {
  const all = await getCategories();
  return all.slice(0, limit);
}

/** Colecciones desde la DB; cae a mock. */
export async function getCollections(): Promise<Collection[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return mockCollections;
  const { data } = await supabase.from("collections").select("*");
  if (!data?.length) return mockCollections;
  return data.map((c, i) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle ?? "",
    image: c.image ?? "",
    align: i % 2 === 1 ? "right" : "left",
  }));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug);
}
