import type { Category } from "@/types";
import { editorial } from "./images";
import { products } from "./products";

/** Cuántos productos hay realmente en cada categoría del catálogo. */
function countOf(slug: string): number {
  return products.filter((p) => p.categorySlug === slug).length;
}

export const categories: Category[] = [
  { name: "Jeans", slug: "jeans", image: editorial("cat-jeans"), count: countOf("jeans") },
  { name: "Remeras", slug: "remeras", image: editorial("cat-remeras"), count: countOf("remeras") },
  { name: "Buzos", slug: "buzos", image: editorial("cat-buzos"), count: countOf("buzos") },
  {
    name: "Zapatillas",
    slug: "zapatillas",
    image: editorial("cat-zapatillas"),
    count: countOf("zapatillas"),
  },
  {
    name: "Accesorios",
    slug: "accesorios",
    image: editorial("cat-accesorios"),
    count: countOf("accesorios"),
  },
  {
    name: "Bermudas",
    slug: "bermudas",
    image: editorial("cat-bermudas"),
    count: countOf("bermudas"),
  },
];

/** Mosaico del home: en GoodStyle entran las seis categorías. */
export const featuredCategories = categories;
