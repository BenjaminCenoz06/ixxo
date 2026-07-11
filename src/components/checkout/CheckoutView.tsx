"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, Package } from "lucide-react";
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
}

export default function CheckoutView() {
  const { items, subtotal, coupon, clear } = useCart();
  const { user } = useAuth();
  const { general } = useSiteContent();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<Partial<ShippingForm>>();
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const quote = quoteShipping(shipping?.province, subtotal, coupon, general.freeShippingThreshold || undefined);
  const eta = quote.free
    ? "Envío gratis"
    : `Llega en ${quote.minDays}–${quote.maxDays} días hábiles`;

  const persistOrder = async (number: string, totals: ReturnType<typeof computeTotals>) => {
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
        shippingAddress: shipping ?? {},
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

  const simulateConfirmation = (number: string, total: number) => {
    setTimeout(() => {
      setOrder({ number, email: shipping?.email ?? "", total });
      clear();
      setProcessing(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1600);
  };

  const placeOrder = async (method: Method) => {
    setProcessing(true);
    const totals = computeTotals(subtotal, coupon, quote.cost);
    const number = `IXXO-${Math.floor(100000 + Math.random() * 900000)}`;

    // Registra el pedido (best-effort, no bloquea la confirmación).
    persistOrder(number, totals).catch(() => {});

    // Transferencia → confirmación directa. Tarjeta / Mercado Pago → checkout de MP.
    if (method !== "transfer") {
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

    simulateConfirmation(number, totals.total);
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
          <OrderSummary shipping={quote.cost} eta={step >= 1 ? eta : undefined} />
        </aside>
      </div>
    </div>
  );
}

function Confirmation({ order }: { order: Order }) {
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
        <p className="eyebrow mt-8">Pedido confirmado</p>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight md:text-5xl">
          ¡Gracias por tu compra!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ash">
          Tu pedido <span className="font-medium text-ink">{order.number}</span> fue registrado por{" "}
          <span className="font-medium text-ink">{formatPrice(order.total)}</span>. Te enviamos la
          confirmación {order.email ? `a ${order.email}` : "por email"}.
        </p>

        <div className="mx-auto mt-10 flex max-w-sm items-center gap-4 border border-line p-5 text-left">
          <Package size={26} strokeWidth={1.3} className="shrink-0 text-ink-soft" />
          <div>
            <p className="text-[13px] font-medium">Preparando tu envío</p>
            <p className="text-[12px] text-ash">Llega en 2 a 5 días hábiles. Te avisamos cuando despache.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
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
