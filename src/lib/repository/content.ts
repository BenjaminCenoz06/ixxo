import "server-only";
import { unstable_cache } from "next/cache";
import { SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";
import { mergeContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { TAG_CONTENT, CACHE_TTL_SECONDS } from "@/lib/cache";

/** URL pública del JSON de contenido en Storage. */
export const CONTENT_URL = `${SUPABASE_URL}/storage/v1/object/public/media/config/home.json`;

/**
 * Descarga el JSON de contenido de Storage, cacheado bajo la etiqueta
 * `content`. Este archivo se leía en cada render de cada página y se sube con
 * `cacheControl: "0"`, así que iba entero al origen todas las veces: era una
 * de las dos fuentes principales del egress que restringió el proyecto.
 *
 * El `cache: "no-store"` de adentro es a propósito: el cacheo lo maneja
 * `unstable_cache`, que es el que se puede invalidar por etiqueta.
 */
const readContentFromStorage = unstable_cache(
  async (): Promise<Partial<SiteContent> | null> => {
    const res = await fetch(CONTENT_URL, { cache: "no-store" });
    // Todavía no se guardó contenido desde el panel: es una respuesta válida
    // y estable, así que cachearla está bien.
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Partial<SiteContent>;
  },
  ["contenido-sitio"],
  { tags: [TAG_CONTENT], revalidate: CACHE_TTL_SECONDS },
);

/** Lee el contenido del sitio desde Storage; cae a los defaults si no existe. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return DEFAULT_CONTENT;
  try {
    const data = await readContentFromStorage();
    return data ? mergeContent(data) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}
