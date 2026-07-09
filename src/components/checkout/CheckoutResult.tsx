"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, X, Package } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "approved" | "pending" | "failure";

const CONFIG: Record<
  Status,
  { icon: typeof Check; bg: string; eyebrow: string; title: string; message: string }
> = {
  approved: {
    icon: Check,
    bg: "bg-ink text-paper",
    eyebrow: "Pago aprobado",
    title: "¡Gracias por tu compra!",
    message: "Recibimos tu pago y ya estamos preparando tu pedido.",
  },
  pending: {
    icon: Clock,
    bg: "bg-smoke text-ink",
    eyebrow: "Pago pendiente",
    title: "Estamos procesando tu pago",
    message: "Te avisaremos por email en cuanto se acredite. Puede demorar unos minutos.",
  },
  failure: {
    icon: X,
    bg: "bg-accent text-paper",
    eyebrow: "Pago rechazado",
    title: "No pudimos procesar el pago",
    message: "No se realizó ningún cargo. Probá con otro medio de pago.",
  },
};

export default function CheckoutResult({ status, order }: { status: Status; order?: string }) {
  const { clear } = useCart();

  useEffect(() => {
    if (status === "approved" || status === "pending") clear();
  }, [status, clear]);

  const c = CONFIG[status];

  return (
    <div className="container-ixxo flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-24 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`flex h-20 w-20 items-center justify-center rounded-full ${c.bg}`}
      >
        <c.icon size={34} strokeWidth={2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
      >
        <p className="eyebrow mt-8">{c.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight md:text-5xl">
          {c.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ash">
          {c.message}
          {order && (
            <>
              {" "}
              Pedido <span className="font-medium text-ink">{order}</span>.
            </>
          )}
        </p>

        {status === "approved" && (
          <div className="mx-auto mt-10 flex max-w-sm items-center gap-4 border border-line p-5 text-left">
            <Package size={26} strokeWidth={1.3} className="shrink-0 text-ink-soft" />
            <div>
              <p className="text-[13px] font-medium">Preparando tu envío</p>
              <p className="text-[12px] text-ash">Llega en 2 a 8 días hábiles según tu zona.</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {status === "failure" ? (
            <Link
              href="/checkout"
              className="bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
            >
              Reintentar pago
            </Link>
          ) : (
            <Link
              href="/prendas"
              className="bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
            >
              Seguir comprando
            </Link>
          )}
          <Link
            href="/cuenta"
            className="border border-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            Ver mis pedidos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
