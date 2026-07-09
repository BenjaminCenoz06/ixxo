"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase/client";
import { useAuth } from "./auth-context";

interface FavoritesContextValue {
  ids: string[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "ixxo-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cargar de localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  // Al iniciar sesión, mezclar favoritos locales con los de la cuenta.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("favorites").select("product_id").eq("user_id", user.id);
      if (cancelled || !data) return;
      const remote = data.map((r) => r.product_id);
      setIds((local) => {
        const merged = Array.from(new Set([...remote, ...local]));
        // Subir los locales que faltan en la cuenta.
        const missing = local.filter((id) => !remote.includes(id));
        if (missing.length) {
          supabase
            .from("favorites")
            .upsert(missing.map((product_id) => ({ user_id: user.id, product_id })));
        }
        return merged;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((x) => x !== id) : [...prev, id];
        const supabase = getSupabaseBrowser();
        if (supabase && user) {
          if (has) {
            supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id);
          } else {
            supabase.from("favorites").upsert({ user_id: user.id, product_id: id });
          }
        }
        return next;
      });
    },
    [user],
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, count: ids.length, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
