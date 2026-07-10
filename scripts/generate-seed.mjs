/**
 * Genera supabase/seed.sql a partir de los datos del catálogo.
 * Mantener la data alineada con src/data/*. Ejecutar: `npm run seed:gen`.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// Usa las mismas imágenes que la app (Unsplash), vía type-stripping de Node 24.
import { editorial, editorialWide } from "../src/data/images.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CATS = [
  ["Remeras", "remeras", 48], ["Camisas", "camisas", 32], ["Buzos", "buzos", 27],
  ["Camperas", "camperas", 21], ["Jeans", "jeans", 24], ["Pantalones", "pantalones", 30],
  ["Joggers", "joggers", 18], ["Sweaters", "sweaters", 16], ["Bermudas", "bermudas", 14],
  ["Zapatillas", "zapatillas", 22], ["Accesorios", "accesorios", 40],
];

const COLLECTIONS = [
  ["essentials", "Essentials", "Las bases del guardarropa. Cortes limpios, tejidos nobles."],
  ["tailoring", "Tailoring", "Sastrería contemporánea para el hombre urbano."],
  ["winter-26", "Invierno 26", "Abrigo estructurado en una paleta de grises y negros."],
];

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const BOTTOMS = ["28", "30", "32", "34", "36"];
const SHOES = ["39", "40", "41", "42", "43", "44"];
const CATEGORY_SLUG = Object.fromEntries(CATS.map(([n, s]) => [n, s]));
const sizesFor = (c) =>
  ["Jeans", "Pantalones", "Bermudas", "Joggers"].includes(c) ? BOTTOMS
    : c === "Zapatillas" ? SHOES : c === "Accesorios" ? ["Único"] : APPAREL;

const seeds = [
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

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `array[${a.map(q).join(", ")}]::text[]`;
const nul = (v, f = (x) => x) => (v === undefined || v === null ? "null" : f(v));

let sql = `-- Generado por scripts/generate-seed.mjs — NO editar a mano.\n\n`;

sql += `insert into public.categories (slug, name, sort) values\n`;
sql += CATS.map(([n, s], i) => `  (${q(s)}, ${q(n)}, ${i})`).join(",\n");
sql += `\non conflict (slug) do nothing;\n\n`;

sql += `insert into public.collections (slug, title, subtitle, image) values\n`;
sql += COLLECTIONS.map(([s, t, sub]) => `  (${q(s)}, ${q(t)}, ${q(sub)}, ${q(editorialWide("col-" + s))})`).join(",\n");
sql += `\non conflict (slug) do nothing;\n\n`;

sql += `insert into public.products\n  (id, slug, name, category_slug, price, compare_at_price, images, colors, sizes, stock, is_new, collection, rating, review_count, description, materials, care)\nvalues\n`;
const DESC = "Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.";
const CARE = ["Lavar a máquina en frío", "No usar lavandina", "Planchar a temperatura media", "No secar en secadora"];
sql += seeds.map((s, i) => {
  const id = `p${String(i + 1).padStart(2, "0")}`;
  const slug = slugify(s.name);
  const rating = (4.5 + (i % 5) * 0.1).toFixed(1);
  const reviews = 12 + ((i * 7) % 120);
  const images = [editorial(`${id}-a`), editorial(`${id}-b`)];
  return `  (${q(id)}, ${q(slug)}, ${q(s.name)}, ${q(CATEGORY_SLUG[s.category])}, ${s.price}, ${nul(s.compareAtPrice)}, ${arr(images)}, ${arr(s.colors)}, ${arr(sizesFor(s.category))}, ${s.stock ?? 20}, ${!!s.isNew}, ${nul(s.collection, q)}, ${rating}, ${reviews}, ${q(DESC)}, ${arr(s.materials ?? ["Tejido premium seleccionado"])}, ${arr(CARE)})`;
}).join(",\n");
sql += `\non conflict (id) do nothing;\n`;

mkdirSync(resolve(root, "supabase"), { recursive: true });
writeFileSync(resolve(root, "supabase/seed.sql"), sql, "utf8");
console.log(`✓ supabase/seed.sql generado (${seeds.length} productos, ${CATS.length} categorías)`);
