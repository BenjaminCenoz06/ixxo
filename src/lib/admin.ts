import { isSupabaseConfigured } from "./supabase/config";

/**
 * Cuenta admin dedicada, siempre habilitada sin depender de env vars: en
 * Netlify no siempre se puede editar NEXT_PUBLIC_ADMIN_EMAILS a mano.
 *
 * Va con alias `+admin` de una casilla real y no con un dominio propio
 * inventado: Supabase valida el destinatario antes de mandar correo, así que
 * con un dominio inexistente la recuperación de contraseña falla con
 * "Email address is invalid" (el login sí funciona, lo cual lo hace fácil de
 * pasar por alto hasta que hace falta recuperar la clave).
 */
const BUILTIN_ADMIN_EMAILS = ["benjamincenozmartines+admin@gmail.com"];

/** Emails autorizados para el panel /admin (dedicada + NEXT_PUBLIC_ADMIN_EMAILS). */
const ADMIN_EMAILS = [
  ...BUILTIN_ADMIN_EMAILS,
  ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(","),
]
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * En modo demo (sin Supabase) el panel es navegable con datos mock y
 * mutaciones locales, para poder diseñarlo y probarlo. Con Supabase
 * activo, requiere un usuario admin real.
 */
export const adminDemoMode = !isSupabaseConfigured;
