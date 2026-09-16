import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { REVALIDATABLE_TAGS, TAG_CATALOG, TAG_CONTENT, PURGAR_YA } from "@/lib/cache";

export const dynamic = "force-dynamic";

/**
 * Invalida el caché de datos de ESTE deploy.
 *
 * Existe porque el panel y la tienda son dos sitios de Netlify distintos: cada
 * uno tiene su propio caché, así que un `revalidateTag` hecho en el panel no
 * toca a la tienda. El panel llama acá (a través de /api/admin/revalidate-shop,
 * que es quien guarda el secreto) apenas guarda algo.
 *
 * Se protege con un secreto compartido y no con la sesión de Supabase, porque
 * el pedido viene de servidor a servidor y entre dominios distintos, donde la
 * cookie de sesión no viaja.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET no configurado" }, { status: 503 });
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const pedidas = Array.isArray(body.tags) ? body.tags.map(String) : [];
  // Sólo etiquetas conocidas: que nadie invalide algo arbitrario.
  const tags = pedidas.length
    ? pedidas.filter((t): t is (typeof REVALIDATABLE_TAGS)[number] =>
        (REVALIDATABLE_TAGS as readonly string[]).includes(t),
      )
    : [TAG_CATALOG, TAG_CONTENT];

  for (const tag of tags) revalidateTag(tag, PURGAR_YA);

  return NextResponse.json({ revalidated: tags });
}
