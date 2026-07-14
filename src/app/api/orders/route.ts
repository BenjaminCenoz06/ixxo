import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSiteContent } from "@/lib/repository/content";
import { sendNewOrderEmail } from "@/lib/email";

interface Item {
  productId: string;
  name: string;
  image?: string;
  color: string;
  size: string;
  qty: number;
  price: number;
}

interface Body {
  number: string;
  userId?: string | null;
  email: string;
  status?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string | null;
  shippingAddress?: Record<string, unknown>;
  items: Item[];
}

/**
 * Crea un pedido con la service role (salta RLS, valida en el servidor).
 * No-op silencioso si Supabase no está configurado.
 */
export async function POST(request: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ persisted: false });

  try {
    const body = (await request.json()) as Body;

    const { data, error } = await admin
      .from("orders")
      .insert({
        number: body.number,
        user_id: body.userId ?? null,
        email: body.email,
        status: body.status ?? "pending",
        subtotal: body.subtotal,
        discount: body.discount,
        shipping: body.shipping,
        total: body.total,
        coupon: body.coupon ?? null,
        shipping_address: (body.shippingAddress ?? {}) as never,
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ persisted: false, error: error?.message }, { status: 500 });
    }

    if (body.items?.length) {
      await admin.from("order_items").insert(
        body.items.map((it) => ({
          order_id: data.id,
          product_id: it.productId,
          name: it.name,
          image: it.image ?? null,
          color: it.color,
          size: it.size,
          qty: it.qty,
          price: it.price,
        })),
      );
    }

    // Aviso al dueño (email de la tienda) con el detalle completo del pedido.
    notifyOwner(body).catch(() => {});

    return NextResponse.json({ persisted: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ persisted: false, error: String(e) }, { status: 500 });
  }
}

/** Envía el aviso de nuevo pedido al dueño (best-effort). */
async function notifyOwner(body: Body) {
  const sa = (body.shippingAddress ?? {}) as Record<string, unknown>;
  const { general } = await getSiteContent();
  const to =
    process.env.ORDER_NOTIFICATION_EMAIL ||
    general.email ||
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",")[0]?.trim() ||
    "";
  if (!to) return;

  await sendNewOrderEmail({
    to,
    storeName: general.storeName,
    order: {
      number: body.number,
      customerName: [sa.firstName, sa.lastName].filter(Boolean).join(" ").trim() || body.email,
      email: body.email,
      phone: (sa.phone as string) ?? "",
      paymentMethod: (sa.paymentMethod as string) ?? "",
      shippingType: (sa.shippingType as string) ?? "",
      shippingCompany: (sa.shippingCompany as string) ?? "",
      address: [sa.address, sa.city, sa.province].filter(Boolean).join(", "),
      needsInvoice: !!sa.needsInvoice,
      invoiceName: (sa.invoiceName as string) ?? "",
      invoiceCuit: (sa.invoiceCuit as string) ?? "",
      subtotal: body.subtotal,
      discount: body.discount,
      shipping: body.shipping,
      total: body.total,
      items: body.items ?? [],
    },
  });
}
