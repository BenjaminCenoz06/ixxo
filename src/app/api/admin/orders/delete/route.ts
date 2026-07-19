import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

/**
 * Borra uno o varios pedidos por número (order_items se borra en cascada).
 * Requiere sesión de administrador. Se usa para borrar un pedido suelto o
 * para el "cierre de mes" (borrar todos los pedidos de un mes tras descargar
 * el reporte).
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

  const { numbers } = (await request.json()) as { numbers?: string[] };
  if (!numbers?.length) {
    return NextResponse.json({ error: "No se indicaron pedidos" }, { status: 400 });
  }

  const { error, count } = await admin
    .from("orders")
    .delete({ count: "exact" })
    .in("number", numbers);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, deleted: count ?? numbers.length });
}
