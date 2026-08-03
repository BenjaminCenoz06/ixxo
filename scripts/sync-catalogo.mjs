/**
 * Sincroniza el catálogo del código hacia Supabase (categorías, colecciones y
 * productos). Es DML, no DDL, así que corre con la service role key sin
 * necesidad de la contraseña de la base.
 *
 * Sirve para dos cosas:
 *  - Sembrar una base recién creada sin pegar el SQL a mano.
 *  - Corregir una base que quedó con datos viejos: borra lo que ya no está en
 *    el catálogo, en vez de acumular (el seed usa `on conflict do nothing`, así
 *    que volver a correrlo NO limpia lo anterior).
 *
 * Uso: node scripts/sync-catalogo.mjs [--dry]
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const dry = process.argv.includes("--dry");

// .env.local no se carga solo en un script suelto.
for (const linea of readFileSync(resolve(root, ".env.local"), "utf8").split("\n")) {
  const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

register("./ts-resolver.mjs", import.meta.url);
const { products } = await import("../src/data/products.ts");
const { categories } = await import("../src/data/categories.ts");
const { collections } = await import("../src/data/collections.ts");

const db = createClient(url, key, { auth: { persistSession: false } });

const filaCategoria = (c, i) => ({ slug: c.slug, name: c.name, image: c.image ?? null, sort: i });
const filaColeccion = (c) => ({
  slug: c.slug,
  title: c.title,
  subtitle: c.subtitle ?? null,
  image: c.image ?? null,
});
const filaProducto = (p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category_slug: p.categorySlug,
  price: p.price,
  compare_at_price: p.compareAtPrice ?? null,
  images: p.images,
  colors: p.colors,
  sizes: p.sizes,
  stock: p.stock ?? 0,
  is_new: !!p.isNew,
  collection: p.collection ?? null,
  // El local no tiene opiniones cargadas: inventarlas alimentaría estrellas
  // falsas en Google vía ProductJsonLd.
  rating: 0,
  review_count: 0,
  description: p.description ?? null,
  materials: p.materials ?? null,
  care: p.care ?? null,
});

async function sobrantes(tabla, columna, vigentes) {
  const { data, error } = await db.from(tabla).select(columna);
  if (error) throw new Error(`${tabla}: ${error.message}`);
  const vivos = new Set(vigentes);
  return data.map((r) => r[columna]).filter((v) => !vivos.has(v));
}

const cats = categories.map(filaCategoria);
const cols = collections.map(filaColeccion);
const prods = products.map(filaProducto);

// Los productos referencian categories(slug), así que se borran primero.
const prodSobra = await sobrantes("products", "id", prods.map((p) => p.id));
const catSobra = await sobrantes("categories", "slug", cats.map((c) => c.slug));
const colSobra = await sobrantes("collections", "slug", cols.map((c) => c.slug));

console.log(`En el código: ${prods.length} productos, ${cats.length} categorías, ${cols.length} colecciones`);
console.log(`Sobran en la base: ${prodSobra.length} productos, ${catSobra.length} categorías, ${colSobra.length} colecciones`);

if (dry) {
  console.log("\n(--dry: no se escribió nada)");
  if (prodSobra.length) console.log("productos a borrar:", prodSobra.join(", "));
  if (catSobra.length) console.log("categorías a borrar:", catSobra.join(", "));
  process.exit(0);
}

if (prodSobra.length) {
  const { error } = await db.from("products").delete().in("id", prodSobra);
  if (error) throw new Error(`borrando productos: ${error.message}`);
  console.log(`✓ borrados ${prodSobra.length} productos viejos`);
}
if (colSobra.length) {
  const { error } = await db.from("collections").delete().in("slug", colSobra);
  if (error) throw new Error(`borrando colecciones: ${error.message}`);
  console.log(`✓ borradas ${colSobra.length} colecciones viejas`);
}
if (catSobra.length) {
  const { error } = await db.from("categories").delete().in("slug", catSobra);
  if (error) throw new Error(`borrando categorías: ${error.message}`);
  console.log(`✓ borradas ${catSobra.length} categorías viejas`);
}

// Categorías antes que productos: la FK las necesita.
for (const [tabla, filas, conflicto] of [
  ["categories", cats, "slug"],
  ["collections", cols, "slug"],
  ["products", prods, "id"],
]) {
  const { error } = await db.from(tabla).upsert(filas, { onConflict: conflicto });
  if (error) throw new Error(`${tabla}: ${error.message}`);
  console.log(`✓ ${tabla}: ${filas.length} filas`);
}

for (const t of ["categories", "collections", "products"]) {
  const { count } = await db.from(t).select("*", { count: "exact", head: true });
  console.log(`  ${t}: ${count} en la base`);
}
