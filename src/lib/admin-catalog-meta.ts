"use client";

import { useCallback, useEffect, useState } from "react";
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

/** Resultado de una escritura, para que la pantalla pueda avisar si falló. */
export interface SaveResult {
  ok: boolean;
  error?: string;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Traduce los errores de Postgres a algo que el dueño entienda. */
function mensajeDeError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Ya existe otro con ese slug.";
  if (error.code === "23503") return "No se puede borrar: hay productos que lo usan.";
  if (error.code === "42501" || /row-level security/i.test(error.message))
    return "Tu cuenta no tiene permisos de escritura.";
  return error.message;
}

/**
 * CRUD de categorías y colecciones contra Supabase.
 *
 * Antes las escrituras descartaban el error y, si fallaban, igual actualizaban
 * la lista en pantalla: el dueño veía la categoría creada, cerraba el panel y
 * no se había guardado nada. Ahora cada operación devuelve `{ ok, error }` y
 * la lista solo se toca cuando el servidor confirmó.
 */
function crearHookCatalogo<T extends { id?: string; slug: string }>(
  tabla: "categories" | "collections",
  iniciales: T[],
  orden?: string,
) {
  return function useCrud() {
    const [items, setItems] = useState<T[]>(iniciales);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const sb = getSupabaseBrowser();
      if (!sb) return;
      setLoading(true);
      let cancelado = false;

      (async () => {
        const q = sb.from(tabla).select("*");
        const { data, error: err } = await (orden ? q.order(orden) : q);
        if (cancelado) return;
        if (err) setError(`No se pudo leer ${tabla}: ${mensajeDeError(err)}`);
        else if (data?.length) setItems(data as unknown as T[]);
        setLoading(false);
      })();

      return () => {
        cancelado = true;
      };
    }, []);

    const upsert = useCallback(async (fila: T): Promise<SaveResult> => {
      const sb = getSupabaseBrowser();
      // Sin backend el panel es una demo: se edita en memoria y se avisa.
      if (!sb) {
        setItems((prev) => {
          const i = prev.findIndex((c) => c.slug === fila.slug);
          const next = [...prev];
          if (i === -1) next.unshift(fila);
          else next[i] = fila;
          return next;
        });
        return { ok: true };
      }

      // `id` indefinido en un alta rompe el upsert: se manda sin la clave.
      const payload = { ...fila };
      if (!payload.id) delete payload.id;

      // El cliente de Supabase está tipado por tabla y acá `tabla` es una
      // variable, así que infiere la unión de ambas filas y ningún genérico
      // la satisface. Las conversiones quedan acotadas a esta llamada.
      const { data, error: err } = await sb
        .from(tabla)
        .upsert(payload as never, { onConflict: "slug" })
        .select("*")
        .single();

      if (err || !data) {
        const msg = err ? mensajeDeError(err) : "El servidor no devolvió el registro.";
        setError(msg);
        return { ok: false, error: msg };
      }

      const fila_ = data as unknown as T;
      setError(null);
      setItems((prev) => {
        const i = prev.findIndex((c) => c.id === fila_.id || c.slug === fila_.slug);
        const next = [...prev];
        if (i === -1) next.unshift(fila_);
        else next[i] = fila_;
        return next;
      });
      return { ok: true };
    }, []);

    const remove = useCallback(async (fila: T): Promise<SaveResult> => {
      const sb = getSupabaseBrowser();
      if (!sb || !fila.id) {
        setItems((prev) => prev.filter((c) => c.slug !== fila.slug));
        return { ok: true };
      }
      const { error: err } = await sb.from(tabla).delete().eq("id", fila.id);
      if (err) {
        const msg = mensajeDeError(err);
        setError(msg);
        return { ok: false, error: msg };
      }
      setError(null);
      setItems((prev) => prev.filter((c) => c.id !== fila.id));
      return { ok: true };
    }, []);

    return { items, loading, error, upsert, remove };
  };
}

export const useAdminCategories = crearHookCatalogo<AdminCategory>(
  "categories",
  mockCategories.map((c, i) => ({ slug: c.slug, name: c.name, image: c.image, sort: i })),
  "sort",
);

export const useAdminCollections = crearHookCatalogo<AdminCollection>(
  "collections",
  mockCollections.map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    image: c.image,
  })),
);
