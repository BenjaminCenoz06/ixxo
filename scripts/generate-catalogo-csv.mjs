/**
 * Genera el CSV del catálogo de GoodStyle para pegar en la planilla de Google
 * Sheets que alimenta la tienda (ver src/lib/services/google-sheets.ts).
 *
 * La tienda NO lee src/data/products.ts en producción: lee la planilla. Este
 * script traduce el catálogo local al formato de columnas que espera el parser.
 *
 * Uso:  node scripts/generate-catalogo-csv.mjs
 * Salida: scripts/catalogo-goodstyle.csv
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { register } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));

// Node 24 ejecuta TypeScript, pero necesita ayuda con los imports sin extensión.
register("./ts-resolver.mjs", import.meta.url);

const { products } = await import("../src/data/products.ts");

const COLUMNS = [
  "ID",
  "Producto",
  "Categoría",
  "Precio",
  "Precio Oferta",
  "Stock",
  "Estado",
  "Talles",
  "Colores",
  "Descripción",
  "Imágenes",
];

/** Escapa un valor para CSV (comillas dobles y separadores). */
function cell(value) {
  const s = value === undefined || value === null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = products.map((p, i) => [
  i + 1,
  p.name,
  p.category,
  p.price,
  p.compareAtPrice ?? "",
  p.stock,
  "Disponible",
  // El parser separa por comas, así que los talles van "38, 40".
  p.sizes.join(", "),
  p.colors.join(", "),
  p.description ?? "",
  // Vacío: las fotos las carga el dueño. Sin imagen, la tienda usa una de respaldo.
  "",
]);

const csv = [COLUMNS, ...rows].map((r) => r.map(cell).join(",")).join("\n");

const out = join(here, "catalogo-goodstyle.csv");
// BOM para que Google Sheets / Excel respeten los acentos al importar.
writeFileSync(out, "﻿" + csv, "utf8");

const porCategoria = {};
for (const p of products) porCategoria[p.category] = (porCategoria[p.category] ?? 0) + 1;

console.log(`${products.length} productos escritos en ${out}`);
console.log("Por categoría:", porCategoria);
console.log(
  "\nImportalo en la planilla que usa la tienda (Archivo > Importar > Reemplazar hoja).",
);
