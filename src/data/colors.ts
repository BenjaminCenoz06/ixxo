/** Paleta de colores del catálogo — nombre → hex para swatches y filtros. */
export const COLORS: Record<string, string> = {
  Negro: "#0a0a0a",
  Blanco: "#f6f6f4",
  Gris: "#8a8a86",
  "Gris oscuro": "#3a3a3a",
  Arena: "#d8cfc0",
  Camel: "#b79b74",
  Marrón: "#5b4a3a",
  Azul: "#2a3b52",
  Verde: "#3f4a3c",
  Bordó: "#5a2530",
};

export const colorNames = Object.keys(COLORS);

export function colorHex(name: string): string {
  return COLORS[name] ?? "#cccccc";
}
