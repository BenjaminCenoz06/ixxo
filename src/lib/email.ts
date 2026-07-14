import "server-only";

/**
 * Envío de emails transaccionales vía Resend (por fetch, sin dependencia).
 * No-op silencioso si RESEND_API_KEY no está configurada, así el resto del
 * flujo sigue funcionando aunque todavía no se conecte el proveedor de email.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_FROM = process.env.RESEND_FROM ?? "Custom Wear <onboarding@resend.dev>";

export const isEmailConfigured = RESEND_API_KEY.length > 0;

/** Mensaje amable por estado del pedido. */
export const STATUS_MESSAGE: Record<string, string> = {
  pending: "Recibimos tu pedido y está pendiente de pago.",
  paid: "¡Pago confirmado! Ya estamos por preparar tu pedido.",
  preparing: "Estamos preparando tu pedido.",
  shipped: "Tu pedido fue despachado. ¡Ya está en camino!",
  delivered: "Tu pedido fue entregado. ¡Gracias por tu compra!",
  cancelled: "Tu pedido fue cancelado. Ante cualquier duda, escribinos.",
};

export const STATUS_TITLE: Record<string, string> = {
  pending: "Pago pendiente",
  paid: "Pago confirmado",
  preparing: "Preparando tu pedido",
  shipped: "Pedido despachado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
};

function template({
  storeName,
  title,
  message,
  orderNumber,
}: {
  storeName: string;
  title: string;
  message: string;
  orderNumber: string;
}) {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 0">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #eee">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #eee;text-align:center">
          <span style="font-size:20px;font-weight:600;letter-spacing:.28em">${storeName}</span>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#888;margin:0 0 8px">Pedido ${orderNumber}</p>
          <h1 style="font-size:22px;font-weight:400;margin:0 0 12px">${title}</h1>
          <p style="font-size:15px;line-height:1.6;color:#444;margin:0">${message}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #eee;text-align:center">
          <span style="font-size:12px;color:#999">${storeName} · Indumentaria urbana</span>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

export async function sendOrderStatusEmail({
  to,
  orderNumber,
  status,
  storeName = "Custom Wear",
}: {
  to: string;
  orderNumber: string;
  status: string;
  storeName?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured) return { sent: false, error: "email no configurado" };
  if (!to) return { sent: false, error: "sin destinatario" };

  const title = STATUS_TITLE[status] ?? "Actualización de tu pedido";
  const message = STATUS_MESSAGE[status] ?? "Actualizamos el estado de tu pedido.";
  const brand = storeName.replace(/\.$/, "");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to,
        subject: `${title} — Pedido ${orderNumber}`,
        html: template({ storeName: brand, title, message, orderNumber }),
      }),
    });
    if (!res.ok) return { sent: false, error: await res.text() };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: String(e) };
  }
}
