import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

/**
 * Lista los usuarios registrados (auth) para el panel de Clientes.
 * Requiere sesión de administrador; usa la service role para leer auth.users.
 */
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

  const customers: {
    id: string;
    email: string;
    name: string;
    provider: string;
    createdAt: string;
    lastSignIn: string | null;
    orders: number;
    spent: number;
  }[] = [];

  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const u of data.users) {
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
      customers.push({
        id: u.id,
        email: u.email ?? "",
        name: (meta.full_name as string) || (meta.name as string) || "",
        provider: (u.app_metadata?.provider as string) || "email",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at ?? null,
        orders: 0,
        spent: 0,
      });
    }
    if (data.users.length < 200) break;
  }

  // Pedidos reales por cliente (cruzando por email): cantidad y total gastado.
  const PAID = new Set(["paid", "shipped", "delivered"]);
  const stats = new Map<string, { orders: number; spent: number }>();
  const { data: orders } = await admin.from("orders").select("email,total,status");
  for (const o of orders ?? []) {
    const key = (o.email ?? "").toLowerCase();
    if (!key) continue;
    const s = stats.get(key) ?? { orders: 0, spent: 0 };
    if (o.status !== "cancelled") s.orders += 1;
    if (PAID.has(o.status)) s.spent += o.total ?? 0;
    stats.set(key, s);
  }
  for (const c of customers) {
    const s = stats.get(c.email.toLowerCase());
    if (s) {
      c.orders = s.orders;
      c.spent = s.spent;
    }
  }

  customers.sort((a, b) =>
    (b.lastSignIn ?? b.createdAt).localeCompare(a.lastSignIn ?? a.createdAt),
  );

  return NextResponse.json({ customers });
}
