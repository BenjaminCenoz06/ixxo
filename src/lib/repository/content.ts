import "server-only";
import { SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";
import { mergeContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

/** URL pública del JSON de contenido en Storage. */
export const CONTENT_URL = `${SUPABASE_URL}/storage/v1/object/public/media/config/home.json`;

/** Lee el contenido del sitio desde Storage; cae a los defaults si no existe. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return DEFAULT_CONTENT;
  try {
    const res = await fetch(CONTENT_URL, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTENT;
    const data = (await res.json()) as Partial<SiteContent>;
    return mergeContent(data);
  } catch {
    return DEFAULT_CONTENT;
  }
}
