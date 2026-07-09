"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Lock, Check, CreditCard, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export type Method = "mercadopago" | "transfer" | "card";

const methods: { id: Method; label: string; desc: string; icon: typeof Wallet }[] = [
  { id: "mercadopago", label: "Mercado Pago", desc: "Pagá con tu cuenta o como invitado", icon: Wallet },
  { id: "transfer", label: "Transferencia", desc: "15% OFF pagando por transferencia", icon: Landmark },
  { id: "card", label: "Tarjeta de crédito / débito", desc: "Hasta 6 cuotas sin interés", icon: CreditCard },
];

export default function PaymentForm({
  onBack,
  onPlaceOrder,
  processing,
}: {
  onBack: () => void;
  onPlaceOrder: (method: Method) => void;
  processing: boolean;
}) {
  const [method, setMethod] = useState<Method>("mercadopago");

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {methods.map((m) => {
          const active = method === m.id;
          return (
            <li key={m.id}>
              <button
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex w-full items-center gap-4 border px-5 py-4 text-left transition-colors",
                  active ? "border-ink" : "border-line hover:border-ash",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    active ? "border-ink" : "border-stone",
                  )}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                <m.icon size={20} strokeWidth={1.4} className="text-ink-soft" />
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">{m.label}</span>
                  <span className="block text-[12px] text-ash">{m.desc}</span>
                </span>
              </button>

              <AnimatePresence>
                {active && m.id === "card" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 border border-t-0 border-line p-5 sm:grid-cols-2">
                      <input placeholder="Número de tarjeta" className={cardInput} inputMode="numeric" />
                      <input placeholder="Nombre en la tarjeta" className={cardInput} />
                      <input placeholder="Vencimiento (MM/AA)" className={cardInput} />
                      <input placeholder="CVV" className={cardInput} inputMode="numeric" maxLength={4} />
                    </div>
                  </motion.div>
                )}
                {active && m.id === "transfer" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="border border-t-0 border-line p-5 text-[13px] leading-relaxed text-ash">
                      Te enviaremos los datos bancarios por email. Al confirmar el pago, tu pedido se
                      prepara con un <span className="font-medium text-ink">15% de descuento</span>{" "}
                      ya aplicado.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <p className="flex items-center justify-center gap-2 py-2 text-[12px] text-ash">
        <Lock size={13} /> Pago 100% seguro y encriptado
      </p>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink"
        >
          <ArrowLeft size={15} /> Volver a entrega
        </button>
        <button
          onClick={() => onPlaceOrder(method)}
          disabled={processing}
          className="inline-flex items-center gap-2 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {processing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
              Procesando…
            </>
          ) : (
            <>
              <Check size={15} strokeWidth={2.5} /> Confirmar pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const cardInput =
  "w-full border border-line px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink";
