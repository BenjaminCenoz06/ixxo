import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

/** Lista los pedidos reales para el panel (requiere admin). */
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

  const { data, error } = await admin
    .from("orders")
    .select("*, order_items(name, product_id, qty, price)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    number: string;
    email: string;
    status: string;
    total: number;
    created_at: string;
    shipping_address: Record<string, unknown> | null;
    order_items: { name: string; product_id: string; qty: number; price: number }[] | null;
  }>;

  const orders = rows.map((o) => {
    const sa = (o.shipping_address ?? {}) as Record<string, unknown>;
    const name = [sa.firstName, sa.lastName].filter(Boolean).join(" ").trim();
    const lineItems = Array.isArray(o.order_items) ? o.order_items : [];
    return {
      id: o.id,
      number: o.number,
      email: o.email,
      name: name || (o.email as string),
      phone: (sa.phone as string) ?? "",
      securityCode: (sa.securityCode as string) ?? "",
      status: o.status,
      total: o.total,
      items: lineItems.length,
      lineItems: lineItems.map((it) => ({ name: it.name, code: it.product_id, qty: it.qty, price: it.price })),
      createdAt: o.created_at,
      paymentMethod: (sa.paymentMethod as string) ?? "",
      shippingType: (sa.shippingType as string) ?? "",
      shippingCompany: (sa.shippingCompany as string) ?? "",
      needsInvoice: !!sa.needsInvoice,
      invoiceName: (sa.invoiceName as string) ?? "",
      invoiceCuit: (sa.invoiceCuit as string) ?? "",
      address: [sa.address, sa.city, sa.province].filter(Boolean).join(", "),
    };
  });

  return NextResponse.json({ orders });
}
