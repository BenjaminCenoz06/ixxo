import "server-only";
import { getSupabasePublic } from "@/lib/supabase/server";
import { mergeContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

/** Lee el contenido del sitio desde Supabase; cae a los defaults si no existe. */
export async function getSiteContent(): Promise<SiteContent> {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CONTENT;
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "home")
    .maybeSingle();
  if (error || !data) return DEFAULT_CONTENT;
  return mergeContent(data.content as Partial<SiteContent>);
}
