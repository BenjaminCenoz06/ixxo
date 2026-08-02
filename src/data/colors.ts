/** Paleta de colores del catálogo — nombre → hex para swatches y filtros. */
export const COLORS: Record<string, string> = {
  Negro: "#0a0a0a",
  Blanco: "#f6f6f4",
  Gris: "#8a8a86",
  "Gris oscuro": "#3a3a3a",
  "Gris perla": "#c5c5c0",
  Grafito: "#4a4f55",
  Nevado: "#9fb2c4",
  Celeste: "#8fb8dc",
  Azul: "#2a3b52",
  Beige: "#d8cfc0",
  Arena: "#d8cfc0",
  Crema: "#efe6d5",
  Camel: "#b79b74",
  Marrón: "#5b4a3a",
  Chocolate: "#4a3226",
  Óxido: "#a2543a",
  Verde: "#3f4a3c",
  Camuflado: "#5c6046",
  Bordó: "#5a2530",
  Rojo: "#a32020",
  Rosa: "#d9a3b0",
  /** Prendas de un solo color, sin variantes. */
  Único: "#9a9a95",
};

export const colorNames = Object.keys(COLORS);

export function colorHex(name: string): string {
  return COLORS[name] ?? "#cccccc";
}
