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
  pending: "Recibimos tu pedido. Está pendiente de verificación del pago.",
  paid: "¡Confirmamos tu pago! Ya estamos preparando tu pedido. Te avisamos cuando lo enviemos.",
  preparing: "Estamos preparando tu pedido.",
  shipped: "Tu pedido fue enviado. ¡Ya está en camino!",
  delivered: "Tu pedido fue entregado. ¡Gracias por tu compra!",
  cancelled: "Tu pedido fue cancelado. Ante cualquier duda, escribinos.",
};

export const STATUS_TITLE: Record<string, string> = {
  pending: "Compra pendiente de verificación",
  paid: "Pago confirmado",
  preparing: "Preparando tu pedido",
  shipped: "Pedido enviado",
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

const money = (n: number) => "$" + (n ?? 0).toLocaleString("es-AR");

const PAY_LABEL: Record<string, string> = {
  transfer: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
  card: "Tarjeta",
};
const SHIP_LABEL: Record<string, string> = {
  retiro: "Retiro en local",
  correo: "Correo",
  transporte: "Transporte",
};

export interface NewOrderData {
  number: string;
  customerName: string;
  email: string;
  phone?: string;
  paymentMethod?: string;
  shippingType?: string;
  shippingCompany?: string;
  address?: string;
  needsInvoice?: boolean;
  invoiceName?: string;
  invoiceCuit?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  items: { name: string; qty: number; price: number; color?: string; size?: string }[];
}

/** Aviso al dueño (email de la tienda) por cada pedido nuevo, con todo el detalle. */
export async function sendNewOrderEmail({
  to,
  order,
  storeName = "Custom Wear",
}: {
  to: string;
  order: NewOrderData;
  storeName?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured) return { sent: false, error: "email no configurado" };
  if (!to) return { sent: false, error: "sin destinatario" };

  const brand = storeName.replace(/\.$/, "");
  const isTransfer = order.paymentMethod === "transfer";

  const itemsHtml = order.items
    .map(
      (it) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">
          ${it.name}${it.color || it.size ? `<br><span style="color:#888;font-size:12px">${[it.color, it.size].filter(Boolean).join(" · ")}</span>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:center">${it.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:right">${money(it.price * it.qty)}</td>
      </tr>`,
    )
    .join("");

  const row = (k: string, v: string) =>
    v ? `<tr><td style="padding:3px 0;color:#888;font-size:13px">${k}</td><td style="padding:3px 0;font-size:13px;text-align:right">${v}</td></tr>` : "";

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 0"><tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #eee">
      <tr><td style="padding:24px 28px;border-bottom:1px solid #eee;text-align:center">
        <span style="font-size:18px;font-weight:600;letter-spacing:.28em">${brand}</span>
      </td></tr>
      <tr><td style="padding:24px 28px">
        <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#888;margin:0 0 6px">Nuevo pedido</p>
        <h1 style="font-size:22px;font-weight:400;margin:0 0 4px">${order.number}</h1>
        ${isTransfer ? `<p style="margin:8px 0 0;padding:8px 12px;background:#fff7ed;border:1px solid #fed7aa;font-size:13px;color:#9a3412">Pago por <b>transferencia</b> — el cliente indicó que ya transfirió. Verificá el ingreso y confirmá el pago desde el panel.</p>` : ""}

        <h2 style="font-size:14px;margin:22px 0 8px">Cliente</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row("Nombre", order.customerName)}
          ${row("Email", order.email)}
          ${row("Teléfono", order.phone || "")}
        </table>

        <h2 style="font-size:14px;margin:22px 0 8px">Entrega y pago</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row("Pago", PAY_LABEL[order.paymentMethod || ""] || order.paymentMethod || "")}
          ${row("Envío", SHIP_LABEL[order.shippingType || ""] || order.shippingType || "")}
          ${row("Transporte", order.shippingType === "transporte" ? order.shippingCompany || "" : "")}
          ${row("Dirección", order.shippingType !== "retiro" ? order.address || "" : "")}
          ${order.needsInvoice ? row("Factura", `${order.invoiceName || ""} — CUIT ${order.invoiceCuit || ""}`) : ""}
        </table>

        <h2 style="font-size:14px;margin:22px 0 8px">Productos</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><th style="text-align:left;font-size:11px;color:#888;text-transform:uppercase;padding-bottom:6px">Producto</th><th style="font-size:11px;color:#888;text-transform:uppercase;padding-bottom:6px">Cant.</th><th style="text-align:right;font-size:11px;color:#888;text-transform:uppercase;padding-bottom:6px">Importe</th></tr>
          ${itemsHtml}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
          ${row("Subtotal", money(order.subtotal))}
          ${order.discount ? row("Descuento", "-" + money(order.discount)) : ""}
          ${row("Envío", order.shipping ? money(order.shipping) : "Gratis")}
          <tr><td style="padding-top:8px;font-size:16px;font-weight:600;border-top:1px solid #eee">Total</td><td style="padding-top:8px;font-size:16px;font-weight:600;text-align:right;border-top:1px solid #eee">${money(order.total)}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid #eee;text-align:center">
        <span style="font-size:12px;color:#999">${brand} · Aviso automático de pedido</span>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: RESEND_FROM,
        to,
        reply_to: order.email || undefined,
        subject: `🛒 Nuevo pedido ${order.number}${isTransfer ? " — Transferencia" : ""}`,
        html,
      }),
    });
    if (!res.ok) return { sent: false, error: await res.text() };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: String(e) };
  }
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
