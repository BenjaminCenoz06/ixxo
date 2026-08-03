/**
 * Genera supabase/seed.sql a partir del catálogo REAL de GoodStyle.
 *
 * Antes este script tenía su propia lista de 24 productos demo (los de la
 * plantilla Custom Wear, con fotos de Unsplash y ratings inventados). Al correr
 * el seed contra una base nueva, la tienda pasaba a mostrar ese catálogo falso
 * en lugar de las 159 prendas del local. Ahora lee src/data/{products,categories}
 * para que la base y el código no puedan divergir.
 *
 * Ejecutar: `npm run seed:gen`
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Node 24 ejecuta TypeScript, pero necesita ayuda con los imports sin extensión.
register("./ts-resolver.mjs", import.meta.url);

const { products } = await import("../src/data/products.ts");
const { categories } = await import("../src/data/categories.ts");
const { collections } = await import("../src/data/collections.ts").catch(() => ({
  collections: [],
}));

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `array[${a.map(q).join(", ")}]::text[]`;
const nul = (v, f = (x) => x) => (v === undefined || v === null ? "null" : f(v));

let sql = `-- Generado por scripts/generate-seed.mjs — NO editar a mano.\n`;
sql += `-- Catálogo real de GoodStyle: ${products.length} productos.\n\n`;

// ── Categorías ──────────────────────────────────────────────
sql += `insert into public.categories (slug, name, image, sort) values\n`;
sql += categories
  .map((c, i) => `  (${q(c.slug)}, ${q(c.name)}, ${nul(c.image, q)}, ${i})`)
  .join(",\n");
sql += `\non conflict (slug) do nothing;\n\n`;

// ── Colecciones ─────────────────────────────────────────────
if (collections.length) {
  sql += `insert into public.collections (slug, title, subtitle, image) values\n`;
  sql += collections
    .map((c) => `  (${q(c.slug)}, ${q(c.title)}, ${nul(c.subtitle, q)}, ${nul(c.image, q)})`)
    .join(",\n");
  sql += `\non conflict (slug) do nothing;\n\n`;
}

// ── Productos ───────────────────────────────────────────────
sql += `insert into public.products\n`;
sql += `  (id, slug, name, category_slug, price, compare_at_price, images, colors, sizes,\n`;
sql += `   stock, is_new, collection, rating, review_count, description, materials, care)\nvalues\n`;
sql += products
  .map((p) => {
    // rating y review_count en 0: el local no tiene opiniones cargadas y
    // inventarlas alimentaría estrellas falsas en Google (ProductJsonLd).
    const cols = [
      q(p.id),
      q(p.slug),
      q(p.name),
      q(p.categorySlug),
      p.price,
      nul(p.compareAtPrice),
      arr(p.images),
      arr(p.colors),
      arr(p.sizes),
      p.stock ?? 0,
      !!p.isNew,
      nul(p.collection, q),
      0,
      0,
      nul(p.description, q),
      nul(p.materials, arr),
      nul(p.care, arr),
    ];
    return `  (${cols.join(", ")})`;
  })
  .join(",\n");
sql += `\non conflict (id) do nothing;\n`;

mkdirSync(resolve(root, "supabase"), { recursive: true });
writeFileSync(resolve(root, "supabase/seed.sql"), sql, "utf8");

const porCategoria = {};
for (const p of products) porCategoria[p.category] = (porCategoria[p.category] ?? 0) + 1;
console.log(
  `✓ supabase/seed.sql generado — ${products.length} productos, ${categories.length} categorías`,
);
console.log("Por categoría:", porCategoria);
