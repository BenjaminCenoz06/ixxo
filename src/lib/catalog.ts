import type { Product } from "@/types";

export interface Filters {
  colors: string[];
  sizes: string[];
  collections: string[];
  priceMax: number;
  onSale: boolean;
  inStock: boolean;
}

export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevancia" },
  { key: "newest", label: "Novedades" },
  { key: "price-asc", label: "Precio: menor a mayor" },
  { key: "price-desc", label: "Precio: mayor a menor" },
];

export interface Facets {
  colors: string[];
  sizes: string[];
  collections: string[];
  priceMin: number;
  priceMax: number;
}

/** Deriva los valores disponibles para los filtros a partir de un set de productos. */
export function computeFacets(products: Product[]): Facets {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const collections = new Set<string>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const p of products) {
    p.colors.forEach((c) => colors.add(c));
    p.sizes.forEach((s) => sizes.add(s));
    if (p.collection) collections.add(p.collection);
    priceMin = Math.min(priceMin, p.price);
    priceMax = Math.max(priceMax, p.price);
  }

  return {
    colors: [...colors],
    sizes: [...sizes],
    collections: [...collections],
    priceMin: Number.isFinite(priceMin) ? Math.floor(priceMin / 1000) * 1000 : 0,
    priceMax: Math.ceil(priceMax / 1000) * 1000,
  };
}

export function emptyFilters(facets: Facets): Filters {
  return {
    colors: [],
    sizes: [],
    collections: [],
    priceMax: facets.priceMax,
    onSale: false,
    inStock: false,
  };
}

export function countActive(filters: Filters, facets: Facets): number {
  return (
    filters.colors.length +
    filters.sizes.length +
    filters.collections.length +
    (filters.onSale ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceMax < facets.priceMax ? 1 : 0)
  );
}

export function applyFilters(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c))) return false;
    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s))) return false;
    if (f.collections.length && (!p.collection || !f.collections.includes(p.collection)))
      return false;
    if (p.price > f.priceMax) return false;
    if (f.onSale && !p.compareAtPrice) return false;
    if (f.inStock && p.stock <= 0) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    default:
      return list;
  }
}
