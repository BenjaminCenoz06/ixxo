import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

const CONTENT_PATH = "config/home.json";

/**
 * Guarda el contenido del sitio como JSON en el bucket `media` de Storage.
 * Evita depender de una tabla SQL: se puede escribir con la service role.
 */
export async function POST(request: Request) {
  const auth = await getSupabaseServer();
  const admin = getSupabaseAdmin();
  if (!auth || !admin) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const blob = new Blob([JSON.stringify(body)], { type: "application/json" });

  const { error } = await admin.storage.from("media").upload(CONTENT_PATH, blob, {
    contentType: "application/json",
    upsert: true,
    cacheControl: "0",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ saved: true });
}
