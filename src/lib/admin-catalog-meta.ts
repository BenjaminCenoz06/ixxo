"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase/client";
import { categories as mockCategories } from "@/data/categories";
import { collections as mockCollections } from "@/data/collections";

export interface AdminCategory {
  id?: string;
  slug: string;
  name: string;
  image: string | null;
  sort: number;
}
export interface AdminCollection {
  id?: string;
  slug: string;
  title: string;
  subtitle: string | null;
  image: string | null;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useAdminCategories() {
  const [items, setItems] = useState<AdminCategory[]>(
    mockCategories.map((c, i) => ({ slug: c.slug, name: c.name, image: c.image, sort: i })),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setLoading(true);
    sb.from("categories")
      .select("*")
      .order("sort")
      .then(({ data }) => {
        if (data?.length) setItems(data as AdminCategory[]);
        setLoading(false);
      });
  }, []);

  async function upsert(cat: AdminCategory) {
    const sb = getSupabaseBrowser();
    if (sb) {
      const { data } = await sb
        .from("categories")
        .upsert({ id: cat.id, slug: cat.slug, name: cat.name, image: cat.image, sort: cat.sort })
        .select("*")
        .single();
      if (data) {
        setItems((prev) => {
          const idx = prev.findIndex((c) => c.id === data.id || c.slug === data.slug);
          const next = [...prev];
          if (idx === -1) next.unshift(data as AdminCategory);
          else next[idx] = data as AdminCategory;
          return next;
        });
        return;
      }
    }
    // Demo/local
    setItems((prev) => {
      const idx = prev.findIndex((c) => c.slug === cat.slug);
      const next = [...prev];
      if (idx === -1) next.unshift(cat);
      else next[idx] = cat;
      return next;
    });
  }

  async function remove(cat: AdminCategory) {
    setItems((prev) => prev.filter((c) => (cat.id ? c.id !== cat.id : c.slug !== cat.slug)));
    const sb = getSupabaseBrowser();
    if (sb && cat.id) await sb.from("categories").delete().eq("id", cat.id);
  }

  return { items, loading, upsert, remove };
}

export function useAdminCollections() {
  const [items, setItems] = useState<AdminCollection[]>(
    mockCollections.map((c) => ({ slug: c.slug, title: c.title, subtitle: c.subtitle, image: c.image })),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setLoading(true);
    sb.from("collections")
      .select("*")
      .then(({ data }) => {
        if (data?.length) setItems(data as AdminCollection[]);
        setLoading(false);
      });
  }, []);

  async function upsert(col: AdminCollection) {
    const sb = getSupabaseBrowser();
    if (sb) {
      const { data } = await sb
        .from("collections")
        .upsert({ id: col.id, slug: col.slug, title: col.title, subtitle: col.subtitle, image: col.image })
        .select("*")
        .single();
      if (data) {
        setItems((prev) => {
          const idx = prev.findIndex((c) => c.id === data.id || c.slug === data.slug);
          const next = [...prev];
          if (idx === -1) next.unshift(data as AdminCollection);
          else next[idx] = data as AdminCollection;
          return next;
        });
        return;
      }
    }
    setItems((prev) => {
      const idx = prev.findIndex((c) => c.slug === col.slug);
      const next = [...prev];
      if (idx === -1) next.unshift(col);
      else next[idx] = col;
      return next;
    });
  }

  async function remove(col: AdminCollection) {
    setItems((prev) => prev.filter((c) => (col.id ? c.id !== col.id : c.slug !== col.slug)));
    const sb = getSupabaseBrowser();
    if (sb && col.id) await sb.from("collections").delete().eq("id", col.id);
  }

  return { items, loading, upsert, remove };
}
