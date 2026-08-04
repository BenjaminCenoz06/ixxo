import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Nombre de archivo seguro y estable a partir del mail. */
function claveDe(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/**
 * Alta al newsletter.
 *
 * Los suscriptores viven en Storage, un archivo JSON por mail, y no en una
 * tabla: crear tablas necesita acceso DDL a la base, que no está disponible
 * desde acá. Un archivo por suscriptor evita además pisar altas simultáneas,
 * que es lo que pasaría con una sola lista compartida. Si algún día se crea
 * una tabla `newsletter`, migrar es leer el directorio una vez.
 */
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: "" }));

  if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Almacenamiento no configurado" }, { status: 503 });
  }

  const limpio = email.trim().toLowerCase();
  const cuerpo = JSON.stringify({ email: limpio, date: new Date().toISOString() });

  const { error } = await admin.storage
    .from("media")
    .upload(`newsletter/${claveDe(limpio)}.json`, new Blob([cuerpo], { type: "application/json" }), {
      upsert: true,
      contentType: "application/json",
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
