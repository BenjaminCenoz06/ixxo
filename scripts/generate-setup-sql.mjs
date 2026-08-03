/**
 * Arma supabase/setup.sql concatenando schema + admin + seed.
 *
 * Existía como archivo suelto y quedó desactualizado: seguía trayendo el seed
 * viejo de la plantilla (Custom Wear, fotos de Unsplash) mucho después de que
 * el catálogo real fuera otro. Generarlo evita que vuelva a divergir.
 *
 * Ejecutar: `npm run setup:gen` (o `npm run seed:gen && npm run setup:gen`).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const partes = ["schema.sql", "admin.sql", "seed.sql"];

const cabecera = `-- ============================================================
-- GoodStyle — SETUP COMPLETO (schema + admin + seed)
-- Generado por scripts/generate-setup-sql.mjs — NO editar a mano.
-- Pegá TODO este archivo en Supabase → SQL Editor → Run.
-- ============================================================

`;

const cuerpo = partes
  .map((p) => {
    const sql = readFileSync(resolve(root, "supabase", p), "utf8").trimEnd();
    return `-- ─── ${p} ${"─".repeat(Math.max(0, 54 - p.length))}\n\n${sql}\n`;
  })
  .join("\n");

const salida = resolve(root, "supabase/setup.sql");
writeFileSync(salida, cabecera + cuerpo, "utf8");

const lineas = (cabecera + cuerpo).split("\n").length;
console.log(`✓ supabase/setup.sql generado desde ${partes.join(" + ")} (${lineas} líneas)`);
