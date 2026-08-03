import type { Product } from "@/types";
import { editorial } from "./images";

/**
 * Catálogo real de GoodStyle (Ituzaingó, Corrientes).
 * Nombre, categoría, precio y talles según el stock publicado por el local.
 * Los talles listados son los que quedan disponibles de cada prenda.
 */

const CATEGORY_SLUG: Record<string, string> = {
  Bermudas: "bermudas",
  Jeans: "jeans",
  Buzos: "buzos",
  Remeras: "remeras",
  Accesorios: "accesorios",
  Zapatillas: "zapatillas",
};

/** Categorías que llevan instrucciones de lavado. */
const APPAREL = new Set(["Bermudas", "Jeans", "Buzos", "Remeras"]);

const CARE = [
  "Lavar a máquina en frío",
  "No usar lavandina",
  "Planchar a temperatura media",
  "No secar en secadora",
];

const DEFAULT_DESC =
  "Prenda de GoodStyle, indumentaria masculina en Ituzaingó. Escribinos por WhatsApp para reservarla o coordinar el envío.";

/**
 * Color deducido del nombre del producto. El local vende una sola combinación
 * por prenda, así que cuando el nombre no menciona color queda "Único".
 * El orden importa: los nombres compuestos van antes que los simples.
 */
const COLOR_PATTERNS: [RegExp, string][] = [
  [/total black/i, "Negro"],
  [/gris oscuro/i, "Gris oscuro"],
  [/gris carb[oó]n/i, "Gris oscuro"],
  [/gris perla/i, "Gris perla"],
  [/grafito/i, "Grafito"],
  [/celeste/i, "Celeste"],
  [/camuflad/i, "Camuflado"],
  [/\bchoco/i, "Chocolate"],
  [/\bcrem/i, "Crema"],
  [/\bbeige\b/i, "Beige"],
  [/\bbord[oó]\b/i, "Bordó"],
  [/[oó]xido/i, "Óxido"],
  [/\bnevad[oa]\b/i, "Nevado"],
  [/\bblack\b/i, "Negro"],
  [/\bnegro\b/i, "Negro"],
  [/\bblanc[oa]\b|\bwhite\b/i, "Blanco"],
  [/\bgris\b|\bcinza\b/i, "Gris"],
  [/\bazul\b|\bblue\b/i, "Azul"],
  [/\bmarr[oó]n\b|\bbrown\b/i, "Marrón"],
  [/\bverde\b/i, "Verde"],
  [/\brojo\b/i, "Rojo"],
  [/\brosa\b/i, "Rosa"],
];

function colorsFor(name: string): string[] {
  for (const [re, color] of COLOR_PATTERNS) {
    if (re.test(name)) return [color];
  }
  return ["Único"];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Seed {
  name: string;
  category: string;
  price: number;
  /** Talles disponibles. Vacío = producto sin talle (accesorios). */
  sizes?: string[];
  description?: string;
}

const seeds: Seed[] = [
  // ── Bermudas ────────────────────────────────────────────────
  { name: "Super Baggy Nevado", category: "Bermudas", price: 35000, sizes: ["40", "44"] },
  { name: "Super Baggy Celeste Nevado", category: "Bermudas", price: 35000, sizes: ["46"] },
  { name: "Super Baggy Azul Nevado", category: "Bermudas", price: 35000, sizes: ["44"] },
  { name: "Mom Gris Localizado", category: "Bermudas", price: 35000, sizes: ["38"] },
  { name: "Super Baggy Bigotes", category: "Bermudas", price: 35000, sizes: ["42"] },
  { name: "Super Baggy Óxido", category: "Bermudas", price: 35000, sizes: ["40"] },
  { name: "Super Baggy Gris Nevado", category: "Bermudas", price: 35000, sizes: ["40"] },
  { name: "Super Baggy Gris Localizado", category: "Bermudas", price: 35000, sizes: ["42", "44"] },
  { name: "Super Baggy Localizado", category: "Bermudas", price: 35000, sizes: ["44"] },
  { name: "Super Baggy Llamas", category: "Bermudas", price: 35000, sizes: ["42"] },
  { name: "Super Baggy Beige", category: "Bermudas", price: 35000, sizes: ["42"] },
  { name: "Baggy Gris", category: "Bermudas", price: 35000, sizes: ["38"] },
  { name: "Mom Celeste Localizado", category: "Bermudas", price: 35000, sizes: ["40"] },

  // ── Jeans ───────────────────────────────────────────────────
  { name: "Baggy Camuflado Claro", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Baggy Localizado Alto", category: "Jeans", price: 42000, sizes: ["38", "46"] },
  { name: "Semi Baggy Gabardina", category: "Jeans", price: 42000, sizes: ["38", "44"] },
  { name: "Baggy Azul Clásico", category: "Jeans", price: 42000, sizes: ["38", "42"] },
  { name: "Semi Baggy Rasgado", category: "Jeans", price: 42000, sizes: ["44", "46"] },
  { name: "Jogging Baggy Bordó", category: "Jeans", price: 35000, sizes: ["38"] },
  { name: "Semi Baggy Beige", category: "Jeans", price: 42000, sizes: ["44"] },
  { name: "Semi Baggy Gris Carbón", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Semi Baggy Óxido", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Semi Baggy Total Black", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Semi Baggy Gris Perla", category: "Jeans", price: 42000, sizes: ["38", "42"] },
  { name: "Jogging Baggy Gris Perla", category: "Jeans", price: 35000, sizes: ["42"] },
  { name: "Baggy Black Recortes", category: "Jeans", price: 42000, sizes: ["44"] },
  { name: "Jogging Mom Chicago", category: "Jeans", price: 26000, sizes: ["40"] },
  { name: "Jogging Recto", category: "Jeans", price: 32000, sizes: ["42", "44"] },
  { name: "Baggy Nevado Gris", category: "Jeans", price: 42000, sizes: ["44", "46"] },
  { name: "Mom Nevado Azul", category: "Jeans", price: 42000, sizes: ["44"] },
  { name: "Baggy Localizado", category: "Jeans", price: 42000, sizes: ["42"] },
  { name: "Semi Baggy Roturas", category: "Jeans", price: 42000, sizes: ["40", "42"] },
  { name: "Jeans Semi Baggy Óxido", category: "Jeans", price: 42000, sizes: ["42"] },
  { name: "Jeans Semi Baggy Cargo Óxido", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Jeans Semi Baggy Costuras Choco", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Jeans Semi Baggy Gris Nevado Pinzas", category: "Jeans", price: 42000, sizes: ["38"] },
  { name: "Jeans Semi Baggy Gris Oscuro", category: "Jeans", price: 42000, sizes: ["40", "44"] },
  { name: "Baggy Celeste", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Baggy Prototipe", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Joggin Baggy", category: "Jeans", price: 35000, sizes: ["40", "42"] },
  { name: "Mom Localizado", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Jogger Mom Frizado", category: "Jeans", price: 30000, sizes: ["42"] },
  { name: "Baggy Celeste", category: "Jeans", price: 42000, sizes: ["46"] },
  { name: "Baggy Black", category: "Jeans", price: 42000, sizes: ["42"] },
  { name: "Recto Black", category: "Jeans", price: 42000, sizes: ["42"] },
  { name: "Baggy Bolsillos Bordados", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Baggy Cargo Azul Nevado", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Baggy Costuras Blancas", category: "Jeans", price: 42000, sizes: ["42"] },
  { name: "Baggy Gabardina Beige", category: "Jeans", price: 42000, sizes: ["40"] },
  { name: "Baggy Localizado Bigotes", category: "Jeans", price: 42000, sizes: ["40"] },

  // ── Buzos ───────────────────────────────────────────────────
  { name: "Buzo Brakeli Rústico", category: "Buzos", price: 22000, sizes: ["S"] },
  { name: "Buzo Prestige Rústico", category: "Buzos", price: 22000, sizes: ["M"] },
  { name: "Buzo Ever", category: "Buzos", price: 25000, sizes: ["L"] },
  { name: "Buzo Freedom", category: "Buzos", price: 25000, sizes: ["M"] },
  { name: "Buzo iDGAF", category: "Buzos", price: 35000, sizes: ["M"] },
  { name: "Buzo King", category: "Buzos", price: 35000, sizes: ["M"] },
  { name: "Buzo Boxy Gris", category: "Buzos", price: 40000, sizes: ["L"] },
  { name: "Buzo Boxy Total Black", category: "Buzos", price: 40000, sizes: ["S", "M"] },
  { name: "Buzo Clásico Rip Curl", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Buzo Corazón", category: "Buzos", price: 35000, sizes: ["M"] },
  { name: "Buzo Over Blossom", category: "Buzos", price: 38000, sizes: ["S"] },
  { name: "Buzo Over LA", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Buzo Over Ne", category: "Buzos", price: 37000, sizes: ["XL"] },
  { name: "Buzo Over Myself", category: "Buzos", price: 40000, sizes: ["L"] },
  { name: "Buzo Over Rosa", category: "Buzos", price: 35000, sizes: ["S"] },
  { name: "Sweter Plush Gris", category: "Buzos", price: 22500, sizes: ["XL"] },
  { name: "Sweter Plush Marrón", category: "Buzos", price: 22500, sizes: ["L"] },
  { name: "Boxy Black", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Buzo Be Kind", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Sweter White", category: "Buzos", price: 22500, sizes: ["M"] },
  { name: "Boxy Nevado", category: "Buzos", price: 22500, sizes: ["M"] },
  { name: "Buzo Cuello Redondo Bordó", category: "Buzos", price: 37000, sizes: ["M"] },
  { name: "Buzo Cuello Redondo Gris Perla", category: "Buzos", price: 37000, sizes: ["S"] },
  { name: "Buzo Cuello Redondo", category: "Buzos", price: 37000, sizes: ["S", "XL"] },
  { name: "Buzo Over Black", category: "Buzos", price: 40000, sizes: ["S"] },
  { name: "Buzo Clásico London", category: "Buzos", price: 35000, sizes: ["L"] },
  { name: "Buzo Over Espina", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Buzo Over Crem", category: "Buzos", price: 38000, sizes: ["S"] },
  { name: "Buzo Over Wonder", category: "Buzos", price: 40000, sizes: ["S"] },
  { name: "Campera Crema", category: "Buzos", price: 40000, sizes: ["M"] },
  { name: "Sweter White", category: "Buzos", price: 22500, sizes: ["M"] },
  { name: "Campera Camuflada Semi Jeans", category: "Buzos", price: 45000, sizes: ["M"] },
  { name: "Campera Bomber Boxy", category: "Buzos", price: 40000, sizes: ["M"] },

  // ── Remeras ─────────────────────────────────────────────────
  { name: "Chomba Boxy Alemania", category: "Remeras", price: 25000, sizes: ["M"] },
  { name: "Chomba Boxy Good", category: "Remeras", price: 25000, sizes: ["S"] },
  { name: "Chomba Boxy Portugal", category: "Remeras", price: 25000, sizes: ["M"] },
  { name: "Boxy 2023", category: "Remeras", price: 18000, sizes: ["M"] },
  { name: "Boxy Corazón", category: "Remeras", price: 24000, sizes: ["S"] },
  { name: "Boxy Emestudios", category: "Remeras", price: 19000, sizes: ["M"] },
  { name: "Boxy Energy", category: "Remeras", price: 19000, sizes: ["L"] },
  { name: "Boxy Lost", category: "Remeras", price: 19000, sizes: ["L"] },
  { name: "Boxy Love Saint Tela Deportiva", category: "Remeras", price: 15000, sizes: ["M"] },
  { name: "Boxy Nevada", category: "Remeras", price: 20500, sizes: ["L"] },
  { name: "Over Grave", category: "Remeras", price: 19000, sizes: ["M"] },
  { name: "Over Luck This", category: "Remeras", price: 19000, sizes: ["L"] },
  { name: "Over Liso Blue", category: "Remeras", price: 18000, sizes: ["M"] },
  { name: "Over Liso White", category: "Remeras", price: 18000, sizes: ["L"] },
  { name: "Over Nevada Lisa", category: "Remeras", price: 20500, sizes: ["S"] },
  { name: "Over Chateau", category: "Remeras", price: 19000, sizes: ["XXL"] },
  { name: "Over Every Day", category: "Remeras", price: 19000, sizes: ["M"] },
  { name: "Over Fratar Cuello V", category: "Remeras", price: 19000, sizes: ["L"] },
  { name: "Over Vans", category: "Remeras", price: 22000, sizes: ["L"] },
  { name: "Remera Clásica Rusty", category: "Remeras", price: 22000, sizes: ["L"] },
  { name: "Remera Clásica Volcom", category: "Remeras", price: 22000, sizes: ["M"] },
  { name: "Remera Regular Breath", category: "Remeras", price: 19000, sizes: ["L"] },
  { name: "Remera Regular Culture", category: "Remeras", price: 19000, sizes: ["M"] },
  { name: "Remera Regular Is Just", category: "Remeras", price: 19000, sizes: ["XL"] },
  { name: "Remera Over Amalgama", category: "Remeras", price: 19000, sizes: ["M"] },
  { name: "Over Glost", category: "Remeras", price: 19000, sizes: ["M"] },

  // ── Accesorios ──────────────────────────────────────────────
  { name: "Gorra Cerrada Atlantics", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada Boston", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada Jordan 23", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada Jordan NBA", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada Magic", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada Padres 25", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada NY World", category: "Accesorios", price: 25500 },
  { name: "Gorra C/Regulador NY NBA", category: "Accesorios", price: 25500 },
  { name: "Gorra Cerrada NBA", category: "Accesorios", price: 25500 },
  { name: "Gorra New York Azul", category: "Accesorios", price: 12500 },
  { name: "Gorra New York", category: "Accesorios", price: 12500 },
  { name: "Gorra Boston", category: "Accesorios", price: 12500 },
  { name: "Gorra Lisa", category: "Accesorios", price: 10000 },
  { name: "Gorra Alo", category: "Accesorios", price: 12500 },
  { name: "Gorra Palmera", category: "Accesorios", price: 12500 },
  { name: "Morral Impermeable", category: "Accesorios", price: 24000 },
  { name: "Riñonera Impermeable", category: "Accesorios", price: 22500 },
  {
    name: "Hawas Malibu 100ML",
    category: "Accesorios",
    price: 50000,
    description:
      "Acuática, cítrica y fresca. Limpia y refrescante, transmite sensación de recién bañado y brisa marina.",
  },
  {
    name: "Hawas Tropical 100ML",
    category: "Accesorios",
    price: 50000,
    description:
      "Muy fresco, alegre y veraniego. Da la sensación de una bebida tropical en la playa.",
  },
  {
    name: "Odyssey Aqua 100ML",
    category: "Accesorios",
    price: 40000,
    description:
      "Un perfume extremadamente fresco, limpio y elegante. Abre con cítricos vibrantes y notas marinas.",
  },
  { name: "Asad Lattafa", category: "Accesorios", price: 50000, description: "100 ml." },
  {
    name: "Fakhar Lattafa",
    category: "Accesorios",
    price: 30000,
    description: "Fragancia árabe moderna con notas frescas, especiadas y amaderadas. 70 ml.",
  },
  {
    name: "Ameerat Al Arab",
    category: "Accesorios",
    price: 40000,
    description: "Fragancia árabe sofisticada con excelente presencia y larga duración. 100 ml.",
  },
  {
    name: "Aimen",
    category: "Accesorios",
    price: 20000,
    description:
      "Aroma equilibrado y elegante, ideal para uso diario y ocasiones especiales. 100 ml.",
  },
  { name: "Insuperable", category: "Accesorios", price: 22000, description: "100 ml." },
  { name: "Sapphire Sky 100ml", category: "Accesorios", price: 35000, description: "100 ml." },
  {
    name: "Rosed Ahar",
    category: "Accesorios",
    price: 20000,
    description:
      "Fragancia con notas florales y dulces que aportan frescura y personalidad. 100 ml.",
  },
  {
    name: "Gorro Boston",
    category: "Accesorios",
    price: 14500,
    description: "Gorro de hilo con logo bordado.",
  },
  {
    name: "Gorro New Orleans",
    category: "Accesorios",
    price: 14500,
    description: "Gorro de hilo con logo bordado.",
  },
  {
    name: "Reloj Digital Resistente al Agua",
    category: "Accesorios",
    price: 22500,
    description: "Resistente al agua, sumergible hasta 10 minutos.",
  },
  {
    name: "Reloj Digital Resistente al Agua Rojo",
    category: "Accesorios",
    price: 22500,
    description: "Resistente al agua, sumergible hasta 10 minutos.",
  },
  { name: "Reloj Clásico", category: "Accesorios", price: 20000, description: "Malla metálica." },
  {
    name: "Cintos",
    category: "Accesorios",
    price: 15000,
    description: "Cintos de cuero con hebilla metálica.",
  },

  // ── Zapatillas ──────────────────────────────────────────────
  { name: "Nike SB Dunk Gris", category: "Zapatillas", price: 80000, sizes: ["40"] },
  { name: "Adidas Forum Cinza/Níkel", category: "Zapatillas", price: 80000, sizes: ["40"] },
  { name: "Nike SB Dunk Lodo", category: "Zapatillas", price: 80000, sizes: ["42"] },
  { name: "Puma 180 Brown", category: "Zapatillas", price: 80000, sizes: ["42"] },
  { name: "Vans Hylane Grafito", category: "Zapatillas", price: 80000, sizes: ["41"] },
  { name: "Vans Hylane Gris", category: "Zapatillas", price: 80000, sizes: ["39"] },
  { name: "Vans Knu Oreo", category: "Zapatillas", price: 80000, sizes: ["39"] },
  { name: "Adidas Forum Black", category: "Zapatillas", price: 70000, sizes: ["38"] },
  { name: "Adidas Forum Gris", category: "Zapatillas", price: 65000, sizes: ["40"] },
  { name: "Adidas Samba Clásicas", category: "Zapatillas", price: 65000, sizes: ["40"] },
  { name: "Converse Clásicas", category: "Zapatillas", price: 35000, sizes: ["39"] },
  { name: "Jordan 4 Bred", category: "Zapatillas", price: 65000, sizes: ["39", "41"] },
  { name: "Nike SB Black", category: "Zapatillas", price: 65000, sizes: ["39"] },
  { name: "Nike SB Gris", category: "Zapatillas", price: 65000, sizes: ["39"] },
  { name: "Nike SB Dunk Low", category: "Zapatillas", price: 65000, sizes: ["42"] },
  { name: "Vans Hylane Ecocuero", category: "Zapatillas", price: 50000, sizes: ["39"] },
  { name: "Vans Old School", category: "Zapatillas", price: 35000, sizes: ["39"] },
];

/** El local repite nombres (mismo modelo, distinto talle): el slug se desambigua. */
const slugCount = new Map<string, number>();

export const products: Product[] = seeds.map((s, i) => {
  const base = slugify(s.name);
  const seen = slugCount.get(base) ?? 0;
  slugCount.set(base, seen + 1);
  const slug = seen === 0 ? base : `${base}-${seen + 1}`;

  const id = `p${String(i + 1).padStart(3, "0")}`;
  const sizes = s.sizes?.length ? s.sizes : ["Único"];

  return {
    id,
    slug,
    name: s.name,
    category: s.category,
    categorySlug: CATEGORY_SLUG[s.category],
    price: s.price,
    // Foto real del local en public/productos, una por prenda (ver README).
    // Se repite en las dos posiciones: el tipo pide un par y el hover de la
    // tarjeta cruza entre ambas; Gallery deduplica para no mostrar la misma
    // miniatura dos veces.
    images: [`/productos/${id}.jpeg`, `/productos/${id}.jpeg`] as [string, string],
    colors: colorsFor(s.name),
    sizes,
    // El local publica los talles que le quedan: una unidad por talle disponible.
    stock: sizes.length,
    rating: 0,
    reviewCount: 0,
    description: s.description ?? DEFAULT_DESC,
    care: APPAREL.has(s.category) ? CARE : undefined,
  };
});

/**
 * Últimos ingresos. El local no marca cuáles son nuevos, así que por defecto se
 * muestran los primeros del catálogo; desde el admin se puede marcar `isNew`.
 */
export const newArrivals = products.some((p) => p.isNew)
  ? products.filter((p) => p.isNew)
  : products.slice(0, 12);

/** Selección del home: los primeros de cada categoría, para mostrar variedad. */
export const featuredProducts = Object.values(CATEGORY_SLUG)
  .flatMap((slug) => products.filter((p) => p.categorySlug === slug).slice(0, 2))
  .slice(0, 8);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

/** Relacionados: misma categoría, distinto producto; completa con otros si faltan. */
export function relatedTo(product: Product, count = 4): Product[] {
  const same = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
  );
  const others = products.filter(
    (p) => p.categorySlug !== product.categorySlug && p.id !== product.id,
  );
  return [...same, ...others].slice(0, count);
}
