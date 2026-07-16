"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, Package, Clock, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useSiteContent } from "@/lib/site-content-context";
import { computeTotals } from "@/lib/checkout";
import { quoteShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";
import type { ShippingForm } from "@/lib/checkout-schema";
import Stepper from "./Stepper";
import CartReview from "./CartReview";
import ShippingFormComp from "./ShippingForm";
import PaymentForm, { type Method } from "./PaymentForm";
import OrderSummary from "./OrderSummary";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Order {
  number: string;
  email: string;
  total: number;
  transfer?: boolean;
  customerName?: string;
  phone?: string;
  paymentMethod?: Method;
  placedAt?: string; // ISO
  securityCode?: string;
  items?: { name: string; code: string; qty: number }[];
}

/** Código de seguridad aleatorio (6-8 alfanuméricos, sin caracteres ambiguos). */
function genSecurityCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const len = 6 + Math.floor(Math.random() * 3); // 6, 7 u 8
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function CheckoutView() {
  const { items, subtotal, coupon, clear } = useCart();
  const { user } = useAuth();
  const { general, shipping: shippingRates } = useSiteContent();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<Partial<ShippingForm>>();
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const isPickup = shipping?.shippingType === "retiro";
  const quote = quoteShipping(shipping?.province, subtotal, coupon, general.freeShippingThreshold || undefined, shippingRates);
  const shipCost = isPickup ? 0 : quote.cost;
  const eta = isPickup
    ? "Retirás en el local"
    : quote.free
      ? "Envío gratis"
      : `Llega en ${quote.minDays}–${quote.maxDays} días hábiles`;

  const persistOrder = async (
    number: string,
    totals: ReturnType<typeof computeTotals>,
    method: Method,
    securityCode: string,
  ) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        userId: user?.id ?? null,
        email: shipping?.email ?? "",
        status: "pending",
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        coupon: coupon?.code ?? null,
        shippingAddress: { ...(shipping ?? {}), paymentMethod: method, securityCode },
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          image: it.image,
          color: it.color,
          size: it.size,
          qty: it.qty,
          price: it.price,
        })),
      }),
    });
  };

  const simulateConfirmation = (finalOrder: Order) => {
    setTimeout(() => {
      setOrder(finalOrder);
      clear();
      setProcessing(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1600);
  };

  const placeOrder = async (method: Method) => {
    setProcessing(true);
    const totals = computeTotals(subtotal, coupon, shipCost);
    const number = `CW-${Math.floor(100000 + Math.random() * 900000)}`;
    const securityCode = genSecurityCode();

    // Snapshot del pedido para la pantalla de éxito (antes de vaciar el carrito).
    const finalOrder: Order = {
      number,
      email: shipping?.email ?? "",
      total: totals.total,
      transfer: method === "transfer",
      customerName: [shipping?.firstName, shipping?.lastName].filter(Boolean).join(" ").trim(),
      phone: shipping?.phone ?? "",
      paymentMethod: method,
      placedAt: new Date().toISOString(),
      securityCode,
      items: items.map((it) => ({ name: it.name, code: it.productId, qty: it.qty })),
    };

    // Registra el pedido (best-effort, no bloquea la confirmación).
    persistOrder(number, totals, method, securityCode).catch(() => {});

    // Transferencia y Mercado Pago (alias) → confirmación directa (pago manual).
    // Tarjeta → checkout de Mercado Pago si hay credenciales; si no, confirmación simulada.
    if (method !== "transfer" && method !== "mercadopago") {
      try {
        const res = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber: number,
            email: shipping?.email ?? "",
            name: shipping?.firstName,
            items: items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
            shippingCost: totals.shipping,
            discount: totals.discount,
          }),
        });
        const data = await res.json();
        const redirect = data.init_point || data.sandbox_init_point;
        if (data.configured && redirect) {
          window.location.href = redirect;
          return;
        }
      } catch {
        /* sin conexión con MP → cae a la confirmación simulada */
      }
    }

    simulateConfirmation(finalOrder);
  };

  // Confirmación
  if (order) return <Confirmation order={order} />;

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="container-ixxo flex min-h-[60vh] flex-col items-center justify-center pt-32 text-center">
        <ShoppingBag size={44} strokeWidth={1} className="text-stone" />
        <h1 className="mt-6 font-display text-3xl font-light">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-ash">Sumá productos para iniciar tu compra.</p>
        <Link
          href="/prendas"
          className="mt-8 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-ixxo pb-24 pt-28 md:pt-36">
      <h1 className="mb-8 text-center font-display text-3xl font-light tracking-tight md:text-4xl">
        Checkout
      </h1>
      <Stepper current={step} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        {/* Paso actual */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {step === 0 && <CartReview onContinue={() => setStep(1)} />}
              {step === 1 && (
                <ShippingFormComp
                  defaultValues={shipping}
                  onBack={() => setStep(0)}
                  onSubmit={(data) => {
                    setShipping(data);
                    setStep(2);
                  }}
                />
              )}
              {step === 2 && (
                <PaymentForm
                  processing={processing}
                  onBack={() => setStep(1)}
                  onPlaceOrder={placeOrder}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Resumen fijo */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary shipping={shipCost} eta={step >= 1 ? eta : undefined} />
        </aside>
      </div>
    </div>
  );
}

const PAY_LABEL: Record<string, string> = {
  transfer: "Transferencia Bancaria",
  mercadopago: "Mercado Pago",
  card: "Tarjeta",
};

const ESTADO_PENDIENTE = "Compra pendiente de verificación";

function Confirmation({ order }: { order: Order }) {
  const { general } = useSiteContent();
  const waNumber = (general.whatsapp || "5493518086096").replace(/\D/g, "");
  const placed = order.placedAt ? new Date(order.placedAt) : new Date();
  const fecha = placed.toLocaleDateString("es-AR");
  const hora = placed.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const payLabel = PAY_LABEL[order.paymentMethod ?? ""] ?? "—";

  const productos = (order.items ?? [])
    .map((it) => `• ${it.name} Código: ${it.code} Cantidad: ${it.qty}`)
    .join("\n");

  const waMessage = [
    "Hola 👋",
    "Realicé un pedido en la tienda.",
    "",
    `Pedido: #${order.number}`,
    order.securityCode ? `Código de seguridad: ${order.securityCode}` : null,
    order.customerName ? `Cliente: ${order.customerName}` : null,
    order.email ? `Email: ${order.email}` : null,
    order.phone ? `Teléfono: ${order.phone}` : null,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
    "",
    "Productos:",
    productos,
    "",
    `Total: ${formatPrice(order.total)}`,
    `Método de pago: ${payLabel}`,
    `Estado: ${ESTADO_PENDIENTE}.`,
    "",
    "Muchas gracias.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="container-ixxo flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-24 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-paper"
      >
        <Check size={34} strokeWidth={2} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
      >
        <p className="eyebrow mt-8">Compra realizada correctamente</p>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight md:text-5xl">
          ¡Gracias por tu compra!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ash">
          Tu pedido <span className="font-medium text-ink">{order.number}</span> quedó registrado
          correctamente por <span className="font-medium text-ink">{formatPrice(order.total)}</span>.
        </p>

        {/* Estado actual: pendiente de verificación */}
        <div className="mt-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-2.5 text-[13px] font-semibold text-amber-700">
            <Clock size={16} strokeWidth={2} />
            Compra pendiente de verificación
          </span>
        </div>

        {/* Mensaje de seguridad */}
        <div className="mx-auto mt-8 flex max-w-md items-start gap-4 border border-line bg-smoke/40 p-5 text-left">
          <ShieldCheck size={26} strokeWidth={1.4} className="mt-0.5 shrink-0 text-ink-soft" />
          <p className="text-[13px] leading-relaxed text-ink-soft">
            Tu pedido fue recibido correctamente y ya quedó registrado en nuestro sistema. Por
            motivos de seguridad, todos los pedidos son verificados manualmente antes de ser
            aprobados. Nuestro equipo comprobará que el pago haya sido acreditado correctamente. Una
            vez confirmado, comenzaremos a preparar tu pedido. Este procedimiento protege tanto a
            nuestros clientes como a nuestra tienda frente a errores, pagos pendientes o intentos de
            fraude. No es necesario realizar nuevamente la compra. Solo aguardá la confirmación.
            Gracias por confiar en nosotros.
          </p>
        </div>

        {/* Detalle del pedido */}
        <dl className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-x-6 gap-y-3 border border-line p-5 text-left text-[13px]">
          <dt className="text-ash">Pedido</dt>
          <dd className="text-right font-medium">{order.number}</dd>
          {order.securityCode && (
            <>
              <dt className="text-ash">Código de seguridad</dt>
              <dd className="text-right font-mono font-semibold tracking-wider">{order.securityCode}</dd>
            </>
          )}
          <dt className="text-ash">Total</dt>
          <dd className="text-right font-medium">{formatPrice(order.total)}</dd>
          <dt className="text-ash">Método de pago</dt>
          <dd className="text-right font-medium">{payLabel}</dd>
          <dt className="text-ash">Fecha</dt>
          <dd className="text-right font-medium">{fecha}</dd>
          <dt className="text-ash">Hora</dt>
          <dd className="text-right font-medium">{hora}</dd>
          <dt className="text-ash">Estado</dt>
          <dd className="text-right font-medium text-amber-700">{ESTADO_PENDIENTE}</dd>
        </dl>

        {/* Botón de WhatsApp con el detalle del pedido precargado */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-[14px] font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl active:scale-95"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Confirmar por WhatsApp
        </a>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/prendas"
            className="bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="border border-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
