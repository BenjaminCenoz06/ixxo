/**
 * Config central de Supabase.
 * `isSupabaseConfigured` permite que toda la app degrade a datos mock
 * cuando todavía no se cargaron las credenciales.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

/**
 * Google OAuth no viene habilitado por defecto en un proyecto Supabase: hay que
 * activar el proveedor y cargar las credenciales de Google Cloud. Sin eso el
 * botón "Continuar con Google" solo devuelve un error, así que se oculta.
 * Activar con NEXT_PUBLIC_GOOGLE_AUTH=true cuando el proveedor esté configurado.
 */
export const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
