import { isSupabaseConfigured } from "./supabase/config";

/** Emails autorizados para el panel /admin. */
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
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
