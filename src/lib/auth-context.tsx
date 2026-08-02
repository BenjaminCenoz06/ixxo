"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./supabase/client";
import { isSupabaseConfigured, SITE_URL, SUPABASE_URL } from "./supabase/config";

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** Hay credenciales de Supabase en el entorno. */
  configured: boolean;
  /** Supabase respondió. En false el proyecto está caído/pausado o sin red. */
  available: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  error: "La autenticación estará disponible al conectar Supabase.",
};

/** Si Supabase no contesta en este tiempo, se lo considera caído. */
const HEALTH_TIMEOUT_MS = 6000;

/**
 * Pinga el endpoint de salud del Auth de Supabase.
 *
 * Hace falta un pedido de red real: `getSession()` resuelve leyendo
 * localStorage y no se entera de que el proyecto está borrado o pausado.
 */
async function probeSupabase(): Promise<boolean> {
  if (!SUPABASE_URL) return false;
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: "GET",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    // Cualquier respuesta HTTP alcanza: el host existe y responde.
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      setAvailable(false);
      return;
    }

    let cancelled = false;

    (async () => {
      // El proyecto puede estar borrado o pausado: si no responde, el panel
      // pasa a modo local en vez de pedir un login imposible de completar.
      const alive = await probeSupabase();
      if (cancelled) return;

      if (!alive) {
        console.warn("[auth] Supabase no responde; se usa el modo local.");
        setAvailable(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setUser(data.session?.user ?? null);
      } catch (err) {
        console.warn("[auth] No se pudo leer la sesión.", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return NOT_CONFIGURED;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: error.message } : { ok: true };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      const supabase = getSupabaseBrowser();
      if (!supabase) return NOT_CONFIGURED;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
      });
      return error ? { ok: false, error: error.message } : { ok: true };
    },
    [],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return NOT_CONFIGURED;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${SITE_URL}/auth/callback` },
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: isSupabaseConfigured,
        available,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
