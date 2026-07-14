import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { getSiteContent } from "@/lib/repository/content";
import { sendOrderStatusEmail } from "@/lib/email";

/** Cambia el estado de un pedido (admin) y envía email al cliente. */
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

  const { number, status } = (await request.json()) as { number?: string; status?: string };
  if (!number || !status) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("orders")
    .update({ status })
    .eq("number", number)
    .select("email")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email al cliente (no bloquea la respuesta si falla).
  let emailed = false;
  try {
    const { general } = await getSiteContent();
    const r = await sendOrderStatusEmail({
      to: (data?.email as string) ?? "",
      orderNumber: number,
      status,
      storeName: general.storeName,
    });
    emailed = r.sent;
  } catch {
    /* email best-effort */
  }

  return NextResponse.json({ ok: true, emailed });
}
