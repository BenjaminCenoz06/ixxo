import type { Category } from "@/types";
import { editorial } from "./images";

export const categories: Category[] = [
  { name: "Remeras", slug: "remeras", image: editorial("cat-remeras"), count: 48 },
  { name: "Camisas", slug: "camisas", image: editorial("cat-camisas"), count: 32 },
  { name: "Buzos", slug: "buzos", image: editorial("cat-buzos"), count: 27 },
  { name: "Camperas", slug: "camperas", image: editorial("cat-camperas"), count: 21 },
  { name: "Jeans", slug: "jeans", image: editorial("cat-jeans"), count: 24 },
  { name: "Pantalones", slug: "pantalones", image: editorial("cat-pantalones"), count: 30 },
  { name: "Joggers", slug: "joggers", image: editorial("cat-joggers"), count: 18 },
  { name: "Sweaters", slug: "sweaters", image: editorial("cat-sweaters"), count: 16 },
  { name: "Bermudas", slug: "bermudas", image: editorial("cat-bermudas"), count: 14 },
  { name: "Zapatillas", slug: "zapatillas", image: editorial("cat-zapatillas"), count: 22 },
  { name: "Accesorios", slug: "accesorios", image: editorial("cat-accesorios"), count: 40 },
  { name: "Novedades", slug: "novedades", image: editorial("cat-novedades"), count: 60 },
  { name: "Ofertas", slug: "ofertas", image: editorial("cat-ofertas"), count: 35 },
];

/** Subconjunto destacado para el mosaico del home. */
export const featuredCategories = categories.filter((c) =>
  ["remeras", "camisas", "camperas", "jeans", "buzos", "zapatillas"].includes(c.slug),
);
