import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { MP_ACCESS_TOKEN, isMercadoPagoConfigured } from "@/lib/mercadopago/config";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const STATUS_MAP: Record<string, string> = {
  approved: "paid",
  pending: "pending",
  in_process: "pending",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "refunded",
};

/**
 * Webhook de notificaciones de pago de Mercado Pago.
 * Actualiza el estado del pedido en Supabase según el pago.
 * Responde 200 siempre para que MP no reintente en loop.
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("type") ?? url.searchParams.get("topic");
    let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    if (!paymentId) {
      const body = await request.json().catch(() => null);
      paymentId = body?.data?.id ?? body?.id ?? null;
    }

    if (!isMercadoPagoConfigured || topic !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = await new Payment(client).get({ id: paymentId });

    const orderNumber = payment.external_reference;
    const status = STATUS_MAP[payment.status ?? ""] ?? "pending";

    const admin = getSupabaseAdmin();
    if (admin && orderNumber) {
      await admin.from("orders").update({ status }).eq("number", orderNumber);
    }

    return NextResponse.json({ received: true, status });
  } catch (error) {
    console.error("[mercadopago] webhook error", error);
    return NextResponse.json({ received: true });
  }
}
