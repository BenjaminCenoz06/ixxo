import type { Category } from "@/types";
import { editorial } from "./images";
import { products } from "./products";

function inCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug);
}

/** Cuántos productos hay realmente en cada categoría del catálogo. */
function countOf(slug: string): number {
  return inCategory(slug).length;
}

/**
 * Foto del tile: la ÚLTIMA prenda real de la categoría. Antes eran fotos de
 * banco (ropa ajena, y repetidas entre secciones). Se toma la última y no la
 * primera porque el home ya muestra las primeras de cada categoría en
 * destacados y novedades, y el tile saldría repetido más abajo.
 */
function photoOf(slug: string): string {
  const items = inCategory(slug);
  return items[items.length - 1]?.images[0] ?? editorial(`cat-${slug}`);
}

function category(name: string, slug: string): Category {
  return { name, slug, image: photoOf(slug), count: countOf(slug) };
}

export const categories: Category[] = [
  category("Jeans", "jeans"),
  category("Remeras", "remeras"),
  category("Buzos", "buzos"),
  category("Zapatillas", "zapatillas"),
  category("Accesorios", "accesorios"),
  category("Bermudas", "bermudas"),
];

/** Mosaico del home: en GoodStyle entran las seis categorías. */
export const featuredCategories = categories;
