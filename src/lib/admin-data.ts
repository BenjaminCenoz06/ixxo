"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { products as mockProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { getSupabaseBrowser } from "./supabase/client";

const nameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

type Row = {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  is_new: boolean;
  collection: string | null;
  rating: number;
  review_count: number;
  description: string | null;
  materials: string[] | null;
  care: string[] | null;
};

function rowToProduct(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: nameBySlug.get(r.category_slug) ?? r.category_slug,
    categorySlug: r.category_slug,
    price: r.price,
    compareAtPrice: r.compare_at_price ?? undefined,
    images: (r.images.length >= 2 ? r.images : [r.images[0] ?? "", r.images[0] ?? ""]) as Product["images"],
    colors: r.colors,
    sizes: r.sizes,
    stock: r.stock,
    isNew: r.is_new,
    collection: r.collection ?? undefined,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    description: r.description ?? undefined,
    materials: r.materials ?? undefined,
    care: r.care ?? undefined,
  };
}

function productToRow(p: Product): Row {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category_slug: p.categorySlug,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    images: p.images,
    colors: p.colors,
    sizes: p.sizes,
    stock: p.stock,
    is_new: !!p.isNew,
    collection: p.collection ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    description: p.description ?? null,
    materials: p.materials ?? null,
    care: p.care ?? null,
  };
}

/**
 * Estado de productos para el admin.
 * Demo: opera sobre datos mock en memoria. Con Supabase: lee/escribe la DB.
 */
/** Resultado de una escritura, para que la pantalla pueda avisar si falló. */
export interface SaveResult {
  ok: boolean;
  error?: string;
}

export function useAdminProducts() {
  const [items, setItems] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data, error: err } = await sb.from("products").select("*").order("created_at");
      if (cancelled) return;
      // Proyecto caído: el panel se queda con el catálogo del código en vez
      // de colgarse cargando para siempre, pero avisando.
      if (err) setError(`No se pudieron leer los productos: ${err.message}`);
      else if (data?.length) setItems((data as Row[]).map(rowToProduct));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Guarda y recién entonces actualiza la lista.
   *
   * Antes se actualizaba la pantalla primero y el error de la escritura se
   * descartaba: si la base rechazaba el guardado, el dueño veía el producto
   * en la lista, se iba, y no se había guardado nada.
   */
  const upsert = async (product: Product): Promise<SaveResult> => {
    const sb = getSupabaseBrowser();
    if (sb) {
      const { error: err } = await sb.from("products").upsert(productToRow(product));
      if (err) {
        const msg =
          err.code === "23503"
            ? "Esa categoría no existe en la base."
            : /row-level security/i.test(err.message)
              ? "Tu cuenta no tiene permisos de escritura."
              : err.message;
        setError(msg);
        return { ok: false, error: msg };
      }
    }
    setError(null);
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx === -1) return [product, ...prev];
      const next = [...prev];
      next[idx] = product;
      return next;
    });
    return { ok: true };
  };

  const remove = async (id: string): Promise<SaveResult> => {
    const sb = getSupabaseBrowser();
    if (sb) {
      const { error: err } = await sb.from("products").delete().eq("id", id);
      if (err) {
        setError(err.message);
        return { ok: false, error: err.message };
      }
    }
    setError(null);
    setItems((prev) => prev.filter((p) => p.id !== id));
    return { ok: true };
  };

  return { items, loading, error, upsert, remove };
}

export function newProductId(): string {
  return `p${Date.now().toString(36)}`;
}
