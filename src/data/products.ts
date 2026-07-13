import type { Product } from "@/types";
import { editorial } from "./images";

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const BOTTOMS = ["28", "30", "32", "34", "36"];
const SHOES = ["39", "40", "41", "42", "43", "44"];

const CATEGORY_SLUG: Record<string, string> = {
  Remeras: "remeras",
  Camisas: "camisas",
  Buzos: "buzos",
  Camperas: "camperas",
  Jeans: "jeans",
  Pantalones: "pantalones",
  Joggers: "joggers",
  Sweaters: "sweaters",
  Bermudas: "bermudas",
  Zapatillas: "zapatillas",
  Accesorios: "accesorios",
};

const DEFAULT_DESC =
  "Una prenda esencial de Custom Wear. Corte cómodo, estilo urbano y terminaciones pensadas para durar. Ideal para tu día a día en la ciudad.";

function sizesFor(category: string): string[] {
  if (["Jeans", "Pantalones", "Bermudas", "Joggers"].includes(category)) return BOTTOMS;
  if (category === "Zapatillas") return SHOES;
  if (category === "Accesorios") return ["Único"];
  return APPAREL;
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
  compareAtPrice?: number;
  colors: string[];
  stock?: number;
  isNew?: boolean;
  collection?: string;
  rating?: number;
  reviewCount?: number;
  materials?: string[];
}

const seeds: Seed[] = [
  { name: "Remera Oversize Heavyweight", category: "Remeras", price: 32900, colors: ["Negro", "Blanco", "Gris"], stock: 42, isNew: true, collection: "Essentials", materials: ["100% algodón peinado 240g"] },
  { name: "Remera Box Fit Pima", category: "Remeras", price: 28900, colors: ["Blanco", "Arena", "Azul"], stock: 60, collection: "Essentials" },
  { name: "Remera Manga Larga Rib", category: "Remeras", price: 36900, colors: ["Negro", "Gris oscuro"], stock: 24, isNew: true },
  { name: "Camisa de Lino Relaxed", category: "Camisas", price: 58900, compareAtPrice: 74900, colors: ["Blanco", "Negro", "Arena"], stock: 3, collection: "Essentials", materials: ["100% lino"] },
  { name: "Camisa Overshirt Franela", category: "Camisas", price: 69900, colors: ["Verde", "Marrón", "Gris oscuro"], stock: 18, collection: "Winter 26" },
  { name: "Camisa Oxford Slim", category: "Camisas", price: 52900, colors: ["Blanco", "Azul"], stock: 30 },
  { name: "Hoodie Brushed Fleece", category: "Buzos", price: 64900, compareAtPrice: 84900, colors: ["Gris", "Negro", "Blanco"], stock: 55, collection: "Essentials", materials: ["Algodón/poliéster 400g brushed"] },
  { name: "Buzo Crewneck Boxy", category: "Buzos", price: 59900, colors: ["Arena", "Negro", "Verde"], stock: 22, isNew: true },
  { name: "Campera Bomber Tech", category: "Camperas", price: 129900, colors: ["Negro", "Gris oscuro"], stock: 17, isNew: true, collection: "Winter 26", materials: ["Nylon técnico impermeable", "Forro acolchado"] },
  { name: "Parka Acolchada Larga", category: "Camperas", price: 189900, compareAtPrice: 219900, colors: ["Negro", "Verde"], stock: 8, collection: "Winter 26" },
  { name: "Campera de Cuero Minimal", category: "Camperas", price: 249900, colors: ["Negro", "Marrón"], stock: 5, collection: "Tailoring", materials: ["Cuero vacuno full grain"] },
  { name: "Jean Slim Raw Selvedge", category: "Jeans", price: 74900, colors: ["Gris oscuro", "Azul"], stock: 28, collection: "Essentials", materials: ["Denim selvedge 13.5oz"] },
  { name: "Jean Straight Washed", category: "Jeans", price: 69900, compareAtPrice: 89900, colors: ["Azul", "Negro"], stock: 34 },
  { name: "Pantalón Sastrero Pleated", category: "Pantalones", price: 79900, colors: ["Negro", "Gris oscuro", "Arena"], stock: 19, collection: "Tailoring", materials: ["Lana fría stretch"] },
  { name: "Pantalón Chino Tapered", category: "Pantalones", price: 62900, colors: ["Arena", "Verde", "Negro"], stock: 40 },
  { name: "Jogger Tech Cónico", category: "Joggers", price: 57900, colors: ["Negro", "Gris"], stock: 33, isNew: true },
  { name: "Sweater Lana Merino", category: "Sweaters", price: 89900, colors: ["Gris oscuro", "Camel", "Negro"], stock: 2, isNew: true, collection: "Tailoring", materials: ["100% lana merino"] },
  { name: "Sweater Half-Zip Cable", category: "Sweaters", price: 84900, colors: ["Arena", "Verde"], stock: 14, collection: "Winter 26" },
  { name: "Cardigan Punto Grueso", category: "Sweaters", price: 96900, compareAtPrice: 119900, colors: ["Marrón", "Gris"], stock: 9 },
  { name: "Bermuda Cargo Ripstop", category: "Bermudas", price: 46900, colors: ["Arena", "Verde", "Negro"], stock: 26 },
  { name: "Zapatillas Leather Minimal", category: "Zapatillas", price: 119900, compareAtPrice: 149900, colors: ["Blanco", "Negro"], stock: 11, collection: "Essentials", materials: ["Cuero premium", "Suela de goma"] },
  { name: "Zapatillas Runner Knit", category: "Zapatillas", price: 109900, colors: ["Negro", "Gris"], stock: 20, isNew: true },
  { name: "Gorra Structured Wool", category: "Accesorios", price: 24900, colors: ["Negro", "Camel", "Gris oscuro"], stock: 50 },
  { name: "Cinturón Cuero Italiano", category: "Accesorios", price: 34900, colors: ["Negro", "Marrón"], stock: 38, collection: "Tailoring", materials: ["Cuero italiano", "Hebilla mate"] },
];

export const products: Product[] = seeds.map((s, i) => {
  const slug = slugify(s.name);
  const id = `p${String(i + 1).padStart(2, "0")}`;
  return {
    id,
    slug,
    name: s.name,
    category: s.category,
    categorySlug: CATEGORY_SLUG[s.category],
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    images: [editorial(`${id}-a`), editorial(`${id}-b`)],
    colors: s.colors,
    sizes: sizesFor(s.category),
    stock: s.stock ?? 20,
    isNew: s.isNew,
    collection: s.collection,
    rating: s.rating ?? 4.5 + (i % 5) * 0.1,
    reviewCount: s.reviewCount ?? 12 + ((i * 7) % 120),
    description: DEFAULT_DESC,
    materials: s.materials ?? ["Tejido premium seleccionado"],
    care: ["Lavar a máquina en frío", "No usar lavandina", "Planchar a temperatura media", "No secar en secadora"],
  };
});

export const featuredProducts = products.slice(0, 8);
export const newArrivals = products.filter((p) => p.isNew);

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
