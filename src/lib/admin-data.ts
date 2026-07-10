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
export function useAdminProducts() {
  const [items, setItems] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setLoading(true);
    sb.from("products")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        if (data?.length) setItems((data as Row[]).map(rowToProduct));
        setLoading(false);
      });
  }, []);

  const upsert = async (product: Product) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx === -1) return [product, ...prev];
      const next = [...prev];
      next[idx] = product;
      return next;
    });
    const sb = getSupabaseBrowser();
    if (sb) await sb.from("products").upsert(productToRow(product));
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    const sb = getSupabaseBrowser();
    if (sb) await sb.from("products").delete().eq("id", id);
  };

  return { items, loading, upsert, remove };
}

export function newProductId(): string {
  return `p${Date.now().toString(36)}`;
}
