import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { notificarTienda } from "@/lib/revalidate";
import { REVALIDATABLE_TAGS, TAG_CATALOG, TAG_CONTENT, PURGAR_YA } from "@/lib/cache";

export const dynamic = "force-dynamic";

/**
 * Puente entre el panel (navegador) y la tienda (otro deploy).
 *
 * El alta/edición/borrado de productos se hace desde el cliente contra
 * Supabase, así que no hay un paso de servidor donde invalidar el caché de la
 * tienda. Este endpoint es ese paso: valida que quien llama sea admin con la
 * cookie de sesión (mismo origen que el panel) y recién ahí reenvía el aviso
 * con el secreto compartido, que nunca sale del servidor.
 */
export async function POST(request: Request) {
  const auth = await getSupabaseServer();
  if (!auth) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const pedidas = Array.isArray(body.tags) ? body.tags.map(String) : [];
  const tags = pedidas.length
    ? pedidas.filter((t) => (REVALIDATABLE_TAGS as readonly string[]).includes(t))
    : [TAG_CATALOG, TAG_CONTENT];

  // El panel también lee por estos repositorios en sus páginas de servidor.
  for (const tag of tags) revalidateTag(tag, PURGAR_YA);

  const avisada = await notificarTienda(tags);
  return NextResponse.json({ tags, tiendaAvisada: avisada });
}
