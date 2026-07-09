import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { MP_ACCESS_TOKEN, isMercadoPagoConfigured } from "@/lib/mercadopago/config";
import { SITE_URL } from "@/lib/supabase/config";

interface Body {
  orderNumber: string;
  email: string;
  name?: string;
  items: { name: string; qty: number; price: number }[];
  shippingCost?: number;
  discount?: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  // Fallback: sin token, el cliente usa la confirmación simulada.
  if (!isMercadoPagoConfigured) {
    return NextResponse.json({ configured: false });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const items = body.items.map((it, i) => ({
      id: `item-${i}`,
      title: it.name,
      quantity: it.qty,
      unit_price: it.price,
      currency_id: "ARS",
    }));

    if (body.shippingCost && body.shippingCost > 0) {
      items.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: body.shippingCost,
        currency_id: "ARS",
      });
    }

    const result = await preference.create({
      body: {
        items,
        payer: { email: body.email, name: body.name },
        external_reference: body.orderNumber,
        statement_descriptor: "IXXO",
        back_urls: {
          success: `${SITE_URL}/checkout/resultado?status=approved&order=${body.orderNumber}`,
          pending: `${SITE_URL}/checkout/resultado?status=pending&order=${body.orderNumber}`,
          failure: `${SITE_URL}/checkout/resultado?status=failure&order=${body.orderNumber}`,
        },
        auto_return: "approved",
        notification_url: `${SITE_URL}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({
      configured: true,
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error("[mercadopago] preference error", error);
    return NextResponse.json({ configured: true, error: "No se pudo crear la preferencia" }, { status: 502 });
  }
}
