import type { Collection } from "@/types";
import { products } from "./products";

/**
 * Colecciones reales del catálogo. Antes eran las tres de la plantilla
 * ("Essentials", "Tailoring", "Invierno 26"): nombres en inglés, fotos de banco
 * y CERO productos, así que sus páginas eran callejones sin salida accesibles
 * desde el menú y el footer.
 *
 * Estas agrupan por corte y tipo, cruzando categorías: el baggy está en jeans y
 * bermudas, el boxy en remeras y buzos. El campo `collection` de cada producto
 * se asigna por regla en `data/products.ts` (COLLECTION_RULES): mantener ambos
 * lados en sintonía.
 */
const DEFINICIONES: Omit<Collection, "image">[] = [
  {
    slug: "baggy",
    title: "Baggy",
    subtitle: "El corte que define al local. Jeans y bermudas anchos, de tiro alto y caída suelta.",
    align: "left",
  },
  {
    slug: "boxy",
    title: "Boxy",
    subtitle: "Remeras, chombas y buzos de calce cuadrado: hombro caído y largo corto.",
    align: "right",
  },
  {
    slug: "gorras",
    title: "Gorras",
    subtitle: "Cerradas y con regulador. Equipos, clásicos y estampas.",
    align: "left",
  },
];

/**
 * Una colección sin prendas no se publica: era justamente el problema de las
 * anteriores. La portada es la ÚLTIMA prenda del grupo, porque el home ya
 * muestra las primeras del catálogo en destacados y novedades.
 */
export const collections: Collection[] = DEFINICIONES.flatMap((def) => {
  const items = products.filter((p) => p.collection === def.title);
  const image = items[items.length - 1]?.images[0];
  return image ? [{ ...def, image }] : [];
});
