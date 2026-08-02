/**
 * Hook de resolución para correr los módulos de `src/` con Node directamente.
 *
 * Node 24 ejecuta TypeScript por type-stripping, pero no resuelve las
 * importaciones sin extensión (`./images`) ni el alias `@/` del tsconfig.
 * Este hook agrega ambas cosas.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const src = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src");

export function resolve_(specifier, context, nextResolve) {
  let spec = specifier;

  if (spec.startsWith("@/")) {
    spec = pathToFileURL(resolve(src, spec.slice(2))).href;
  }

  // Sin extensión: probar .ts / .tsx / index.ts
  if (/^(\.|file:)/.test(spec) && !/\.[a-z]+$/i.test(spec)) {
    const base = spec.startsWith("file:")
      ? fileURLToPath(spec)
      : resolve(dirname(fileURLToPath(context.parentURL)), spec);

    for (const candidate of [`${base}.ts`, `${base}.tsx`, resolve(base, "index.ts")]) {
      if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
  }

  return nextResolve(spec, context);
}

export { resolve_ as resolve };
