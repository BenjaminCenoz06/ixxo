"use client";

import { useEffect, useState } from "react";
import { SUPABASE_URL, isSupabaseConfigured } from "./supabase/config";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./site-content";

const CONTENT_URL = `${SUPABASE_URL}/storage/v1/object/public/media/config/home.json`;

/**
 * Estado editable del contenido del sitio para el admin.
 * Persiste como JSON en Supabase Storage (bucket `media`, config/home.json).
 */
export function useAdminContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetch(`${CONTENT_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setContent(mergeContent(data as Partial<SiteContent>));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo guardar");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return { content, setContent, patch, loading, saving, saved, error, save };
}
