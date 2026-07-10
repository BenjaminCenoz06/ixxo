"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase/client";
import type { Json } from "./supabase/types";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./site-content";

/**
 * Estado editable del contenido del sitio para el admin.
 * Lee/escribe la fila única `site_content` (id='home').
 */
export function useAdminContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.from("site_content")
      .select("content")
      .eq("id", "home")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(mergeContent(data.content as Partial<SiteContent>));
        setLoading(false);
      });
  }, []);

  /** Actualiza una sección del contenido (merge superficial por clave). */
  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const sb = getSupabaseBrowser();
    if (sb) {
      await sb.from("site_content").upsert({
        id: "home",
        content: content as unknown as Json,
        updated_at: new Date().toISOString(),
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return { content, setContent, patch, loading, saving, saved, save };
}
