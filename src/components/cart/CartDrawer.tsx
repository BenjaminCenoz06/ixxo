"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { colorHex } from "@/data/colors";
import Portal from "@/components/ui/Portal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    setQty,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const totals = computeTotals(subtotal, coupon);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = applyCoupon(code);
    setError(!ok);
    if (ok) setCode("");
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[85] bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[86] flex w-full max-w-md flex-col bg-paper"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-label="Carrito de compras"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <h2 className="font-display text-lg tracking-wide">
                  Carrito{items.length > 0 && ` (${items.length})`}
                </h2>
                <button aria-label="Cerrar" onClick={closeCart} className="hover:opacity-60">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="text-stone" />
                  <p className="font-display text-xl font-light">Tu carrito está vacío</p>
                  <p className="text-sm text-ash">Descubrí las últimas novedades de IXXO.</p>
                  <button
                    onClick={closeCart}
                    className="mt-2 bg-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <>
                  {/* Barra envío gratis */}
                  <div className="border-b border-line px-6 py-4">
                    {remaining > 0 ? (
                      <p className="text-[12px] text-ash">
                        Te faltan{" "}
                        <span className="font-medium text-ink">{formatPrice(remaining)}</span> para el
                        envío gratis
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
                        <Check size={13} strokeWidth={2.5} /> ¡Tenés envío gratis!
                      </p>
                    )}
                    <div className="mt-2 h-1 overflow-hidden bg-mist">
                      <motion.div
                        className="h-full bg-ink"
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.lineId}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="flex gap-4 py-5"
                        >
                          <Link
                            href={`/producto/${item.slug}`}
                            onClick={closeCart}
                            className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-smoke"
                          >
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/producto/${item.slug}`}
                                onClick={closeCart}
                                className="text-[14px] leading-snug hover:text-ash"
                              >
                                {item.name}
                              </Link>
                              <button
                                aria-label="Eliminar"
                                onClick={() => removeItem(item.lineId)}
                                className="text-stone transition-colors hover:text-accent"
                              >
                                <Trash2 size={15} strokeWidth={1.5} />
                              </button>
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-[12px] text-ash">
                              <span
                                className="inline-block h-3 w-3 rounded-full border border-line"
                                style={{ backgroundColor: colorHex(item.color) }}
                              />
                              {item.color} · Talle {item.size}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center border border-line">
                                <button
                                  aria-label="Restar"
                                  onClick={() => setQty(item.lineId, item.qty - 1)}
                                  className="flex h-8 w-8 items-center justify-center hover:bg-smoke"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-7 text-center text-[13px] tabular-nums">
                                  {item.qty}
                                </span>
                                <button
                                  aria-label="Sumar"
                                  onClick={() => setQty(item.lineId, item.qty + 1)}
                                  className="flex h-8 w-8 items-center justify-center hover:bg-smoke"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <span className="text-[14px] font-medium">
                                {formatPrice(item.price * item.qty)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* Footer */}
                  <div className="border-t border-line px-6 py-5">
                    {/* Cupón */}
                    {coupon ? (
                      <div className="mb-4 flex items-center justify-between bg-smoke px-3 py-2.5 text-[13px]">
                        <span className="flex items-center gap-2 text-ink">
                          <Tag size={14} /> {coupon.code} — {coupon.label}
                        </span>
                        <button onClick={removeCoupon} aria-label="Quitar cupón">
                          <X size={15} className="text-ash hover:text-ink" />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={submitCoupon} className="mb-4 flex gap-2">
                        <input
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setError(false);
                          }}
                          placeholder="Código de descuento"
                          className="flex-1 border border-line px-3 py-2.5 text-[13px] outline-none focus:border-ink"
                        />
                        <button
                          type="submit"
                          className="border border-ink px-4 text-[12px] font-medium uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper"
                        >
                          Aplicar
                        </button>
                      </form>
                    )}
                    {error && <p className="mb-3 text-[12px] text-accent">Código inválido.</p>}

                    <dl className="space-y-1.5 text-[13px]">
                      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                      {totals.discount > 0 && (
                        <Row label="Descuento" value={`− ${formatPrice(totals.discount)}`} accent />
                      )}
                      <Row
                        label="Envío"
                        value={totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}
                      />
                    </dl>
                    <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                      <span className="text-[13px] font-medium uppercase tracking-wide">Total</span>
                      <span className="text-lg font-medium">{formatPrice(totals.total)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="group mt-4 flex w-full items-center justify-center gap-2 bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
                    >
                      Finalizar compra
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button
                      onClick={closeCart}
                      className="mt-2 w-full py-2 text-[12px] text-ash underline-offset-2 hover:text-ink hover:underline"
                    >
                      Seguir comprando
                    </button>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ash">{label}</dt>
      <dd className={accent ? "text-accent" : "text-ink"}>{value}</dd>
    </div>
  );
}
