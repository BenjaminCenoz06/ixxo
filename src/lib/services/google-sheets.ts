import type { Product } from "@/types";
import { editorial } from "@/data/images";

/**
 * URL de la API creada en Google Apps Script para Cowear.
 */
const GOOGLE_SHEETS_API_URL =
  process.env.GOOGLE_SHEETS_API_URL ||
  "https://script.google.com/macros/s/AKfycbyP7AyCgKFaTtR5x_tbkN3vCpd3CUkP5J0z3WA8oDIhvo3kT6_MUsIv7tqN_NHrE27X/exec";

/**
 * Estructura cruda esperada desde la planilla de Google Sheets.
 * Soporta llaves en español, inglés o minúsculas.
 */
export interface RawGoogleSheetItem {
  // Campos principales solicitados
  Producto?: string;
  producto?: string;
  name?: string;
  Nombre?: string;

  Categoría?: string;
  categoría?: string;
  Categoria?: string;
  categoria?: string;
  category?: string;

  Precio?: number | string;
  precio?: number | string;
  price?: number | string;

  "Precio Oferta"?: number | string;
  "precio oferta"?: number | string;
  precioOferta?: number | string;
  PrecioOferta?: number | string;
  compareAtPrice?: number | string;
  offerPrice?: number | string;

  Stock?: number | string;
  stock?: number | string;

  Estado?: string;
  estado?: string;
  status?: string;
  Status?: string;

  // Campos para futura expansión (Colores, Talles, Variantes, Imágenes, Descuentos)
  Colores?: string[] | string;
  colores?: string[] | string;
  colors?: string[] | string;

  Talles?: string[] | string;
  talles?: string[] | string;
  sizes?: string[] | string;

  Imágenes?: string[] | string;
  imágenes?: string[] | string;
  imagenes?: string[] | string;
  images?: string[] | string;

  Variantes?: Record<string, unknown>[] | string;
  variantes?: Record<string, unknown>[] | string;
  variants?: Record<string, unknown>[] | string;

  Descuento?: number | string;
  descuento?: number | string;
  discount?: number | string;

  Descripción?: string;
  descripción?: string;
  Descripcion?: string;
  descripcion?: string;
  description?: string;
}

/**
 * Utilidad para crear slugs amigables a partir de cadenas de texto.
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parsea un valor numérico seguro desde números o cadenas formateadas (ej: "$32.900" -> 32900).
 */
function parseNumeric(val: number | string | undefined): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "number") return isNaN(val) ? undefined : val;
  const cleaned = val.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

/**
 * Parsea una lista de cadenas o un string separado por comas.
 */
function parseStringList(val: string[] | string | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Obtiene talles por defecto según la categoría.
 */
function defaultSizesForCategory(category: string): string[] {
  const catLower = category.toLowerCase();
  if (
    catLower.includes("jean") ||
    catLower.includes("pantalón") ||
    catLower.includes("pantalon") ||
    catLower.includes("bermuda") ||
    catLower.includes("jogger")
  ) {
    return ["28", "30", "32", "34", "36"];
  }
  if (catLower.includes("zapatilla") || catLower.includes("calzado")) {
    return ["39", "40", "41", "42", "43", "44"];
  }
  if (catLower.includes("accesorio")) {
    return ["Único"];
  }
  return ["XS", "S", "M", "L", "XL", "XXL"];
}

/**
 * Transforma un elemento crudo de Google Sheets al tipo de dominio Product.
 */
export function mapSheetItemToProduct(item: RawGoogleSheetItem, index: number): Product | null {
  const name = item.Producto || item.producto || item.Nombre || item.name;
  if (!name || typeof name !== "string" || !name.trim()) {
    return null;
  }

  const category =
    item.Categoría || item.categoría || item.Categoria || item.categoria || item.category || "General";
  const categorySlug = slugify(category);
  const slug = slugify(name);
  const id = `gs-${index + 1}-${slug}`;

  // Extraer estado y filtrar inactivos
  const estadoStr = String(item.Estado || item.estado || item.status || item.Status || "Activo")
    .trim()
    .toLowerCase();
  
  // Si el estado indica explícitamente inactivo, descartar el producto
  if (["inactivo", "inactive", "false", "0", "borrador", "draft"].includes(estadoStr)) {
    return null;
  }

  // Precios
  const rawPrecio = parseNumeric(item.Precio || item.precio || item.price);
  const rawOferta = parseNumeric(
    item["Precio Oferta"] ||
      item["precio oferta"] ||
      item.precioOferta ||
      item.PrecioOferta ||
      item.compareAtPrice ||
      item.offerPrice
  );

  let price = rawPrecio ?? 0;
  let compareAtPrice: number | undefined = undefined;

  // Lógica de Precio y Precio Oferta:
  // Determina cuál es el precio actual de venta y cuál es el precio tachado de comparación.
  if (rawOferta !== undefined && rawOferta > 0 && rawPrecio !== undefined && rawPrecio > 0) {
    if (rawOferta < rawPrecio) {
      price = rawOferta;
      compareAtPrice = rawPrecio;
    } else if (rawOferta > rawPrecio) {
      price = rawPrecio;
      compareAtPrice = rawOferta;
    }
  } else if (rawOferta !== undefined && rawOferta > 0 && (rawPrecio === undefined || rawPrecio === 0)) {
    price = rawOferta;
  }

  // Stock
  const stock = parseNumeric(item.Stock || item.stock) ?? 10;

  // Campos extendidos / futuros
  const colors = parseStringList(item.Colores || item.colores || item.colors);
  const sizes = parseStringList(item.Talles || item.talles || item.sizes);
  const rawImages = parseStringList(item.Imágenes || item.imágenes || item.imagenes || item.images);

  const finalColors = colors.length > 0 ? colors : ["Negro", "Blanco"];
  const finalSizes = sizes.length > 0 ? sizes : defaultSizesForCategory(category);
  
  // Imágenes: Asegurar al menos 2 imágenes para compatibilidad con la interfaz
  let finalImages: [string, string, ...string[]];
  if (rawImages.length >= 2) {
    finalImages = rawImages as [string, string, ...string[]];
  } else if (rawImages.length === 1) {
    finalImages = [rawImages[0], rawImages[0]];
  } else {
    // Usar imágenes editoriales de fallback según ID
    const imgA = editorial(`p${String((index % 20) + 1).padStart(2, "0")}-a`);
    const imgB = editorial(`p${String((index % 20) + 1).padStart(2, "0")}-b`);
    finalImages = [imgA, imgB];
  }

  const description =
    item.Descripción ||
    item.descripción ||
    item.Descripcion ||
    item.descripcion ||
    item.description ||
    "Una prenda esencial de Custom Wear. Corte cómodo, estilo urbano y terminaciones pensadas para durar. Ideal para tu día a día en la ciudad.";

  return {
    id,
    slug,
    name,
    category,
    categorySlug,
    price,
    compareAtPrice,
    images: finalImages,
    colors: finalColors,
    sizes: finalSizes,
    stock,
    isNew: estadoStr === "nuevo" || estadoStr === "new" || index < 4,
    rating: 4.8,
    reviewCount: 15 + ((index * 7) % 50),
    description,
    materials: ["Tejido premium seleccionado"],
    care: [
      "Lavar a máquina en frío",
      "No usar lavandina",
      "Planchar a temperatura media",
      "No secar en secadora",
    ],
  };
}

/**
 * Obtiene los productos desde la API de Google Sheets con control de errores y timeout.
 */
export async function fetchGoogleSheetsProducts(): Promise<{
  products: Product[];
  error: string | null;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout

    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Revalidar en segundo plano cada 60 segundos
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[GoogleSheets API] HTTP ${response.status}: ${response.statusText}`);
      return {
        products: [],
        error: `La API de Google Sheets respondió con estado HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    // Validar si la respuesta contiene JSON o si devuelve una página HTML de redirección (Google login)
    if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
      console.warn("[GoogleSheets API] La respuesta no es JSON válido (posible redirección HTML/login).");
      return {
        products: [],
        error: "La API de Google Sheets no devolvió un JSON válido. Verifica los permisos de publicación en Google Apps Script.",
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("[GoogleSheets API] Error al parsear JSON:", parseError);
      return {
        products: [],
        error: "Error de formato al procesar la respuesta de la API.",
      };
    }

    // Extraer array de items independientemente de si la API devuelve [...] o { data: [...] } o { products: [...] }
    let rawItems: RawGoogleSheetItem[] = [];
    if (Array.isArray(parsed)) {
      rawItems = parsed;
    } else if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.data)) {
        rawItems = obj.data as RawGoogleSheetItem[];
      } else if (Array.isArray(obj.products)) {
        rawItems = obj.products as RawGoogleSheetItem[];
      } else if (Array.isArray(obj.items)) {
        rawItems = obj.items as RawGoogleSheetItem[];
      }
    }

    if (rawItems.length === 0) {
      return {
        products: [],
        error: "No se encontraron productos en la respuesta de la API de Google Sheets.",
      };
    }

    // Transformar, filtrar y asegurar que cada producto tenga un slug único
    const seenSlugs = new Set<string>();
    const products: Product[] = rawItems
      .map((item, idx) => mapSheetItemToProduct(item, idx))
      .filter((p): p is Product => p !== null)
      .map((p) => {
        let uniqueSlug = p.slug;
        let counter = 1;
        while (seenSlugs.has(uniqueSlug)) {
          counter++;
          uniqueSlug = `${p.slug}-${counter}`;
        }
        seenSlugs.add(uniqueSlug);
        return { ...p, slug: uniqueSlug };
      });

    return { products, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn("[GoogleSheets API] Error al consultar la API:", errorMsg);
    return {
      products: [],
      error: `Error de conexión con Google Sheets: ${errorMsg}`,
    };
  }
}
