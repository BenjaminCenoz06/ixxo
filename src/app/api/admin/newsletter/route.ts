import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export interface Suscriptor {
  email: string;
  date: string;
}

/** Lista los suscriptores reales del newsletter (requiere admin). */
export async function GET() {
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

  const { data: archivos, error } = await admin.storage
    .from("media")
    .list("newsletter", { limit: 1000 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Cada alta es un archivo aparte (ver /api/newsletter), así que se leen todos.
  const subs = await Promise.all(
    (archivos ?? [])
      .filter((f) => f.name.endsWith(".json"))
      .map(async (f) => {
        const { data } = await admin.storage.from("media").download(`newsletter/${f.name}`);
        if (!data) return null;
        try {
          return JSON.parse(await data.text()) as Suscriptor;
        } catch {
          return null;
        }
      }),
  );

  const lista = subs
    .filter((s): s is Suscriptor => !!s?.email)
    .sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json({ subscribers: lista });
}
