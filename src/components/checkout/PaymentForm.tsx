"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Lock, Check, CreditCard, Landmark, Wallet, Copy } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
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
  const { bank } = useSiteContent();

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
                    <TransferDetails bank={bank} />
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
              <Check size={15} strokeWidth={2.5} />{" "}
              {method === "transfer" ? "Ya realicé la transferencia" : "Confirmar pedido"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const cardInput =
  "w-full border border-line px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink";

/** Datos bancarios + QR para pagar por transferencia (todo editable desde el admin). */
function TransferDetails({ bank }: { bank: { banco: string; titular: string; alias: string; cbu: string } }) {
  const [copied, setCopied] = useState<string | null>(null);
  const rows = [
    { k: "Titular", v: bank.titular },
    { k: "Alias", v: bank.alias },
    { k: "CBU", v: bank.cbu },
    { k: "Banco", v: bank.banco },
  ].filter((r) => r.v);

  const qrText = rows.map((r) => `${r.k}: ${r.v}`).join("\n") || "Custom Wear";

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="border border-t-0 border-line p-5">
      <p className="mb-4 text-[13px] leading-relaxed text-ash">
        Transferí el total a esta cuenta. Escaneá el QR con tu app o copiá los datos. Al terminar,
        tocá <span className="font-medium text-ink">“Ya realicé la transferencia”</span> y tu pedido
        queda registrado como <span className="font-medium text-ink">Pago pendiente</span>.
      </p>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {rows.length > 0 && (
          <div className="flex shrink-0 justify-center">
            <div className="border border-line bg-paper p-3">
              <QRCodeSVG value={qrText} size={132} level="M" />
            </div>
          </div>
        )}

        <ul className="flex-1 space-y-2">
          {rows.length === 0 && (
            <li className="text-[13px] text-ash">
              Los datos bancarios se cargan desde el panel de administración.
            </li>
          )}
          {rows.map((r) => (
            <li key={r.k} className="flex items-center justify-between gap-3 border-b border-line pb-2">
              <span>
                <span className="block text-[11px] uppercase tracking-wide text-ash">{r.k}</span>
                <span className="text-[14px] font-medium">{r.v}</span>
              </span>
              <button
                type="button"
                onClick={() => copy(r.k, r.v)}
                className="inline-flex items-center gap-1 text-[11px] text-ash transition-colors hover:text-ink"
              >
                {copied === r.k ? <Check size={13} /> : <Copy size={13} />}
                {copied === r.k ? "Copiado" : "Copiar"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
