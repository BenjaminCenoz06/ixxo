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
      });
    }
    if (data.users.length < 200) break;
  }

  customers.sort((a, b) =>
    (b.lastSignIn ?? b.createdAt).localeCompare(a.lastSignIn ?? a.createdAt),
  );

  return NextResponse.json({ customers });
}
