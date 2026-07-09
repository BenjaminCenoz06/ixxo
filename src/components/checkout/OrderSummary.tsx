"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { computeTotals } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";

export default function OrderSummary({
  compact = false,
  shipping,
  eta,
}: {
  compact?: boolean;
  shipping?: number;
  eta?: string;
}) {
  const { items, subtotal, coupon } = useCart();
  const totals = computeTotals(subtotal, coupon, shipping);

  return (
    <div className="bg-smoke p-6 md:p-7">
      <h2 className="eyebrow mb-5">Tu pedido</h2>

      <ul className={`space-y-4 ${compact ? "" : "max-h-72 overflow-y-auto"}`}>
        {items.map((item) => (
          <li key={item.lineId} className="flex gap-3">
            <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-mist">
              <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-paper">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px]">{item.name}</p>
              <p className="text-[11px] text-ash">
                {item.color} · {item.size}
              </p>
            </div>
            <span className="text-[13px] font-medium">{formatPrice(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-ash">Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-accent">
            <dt>Descuento {coupon ? `(${coupon.code})` : ""}</dt>
            <dd>− {formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ash">
            Envío
            {eta && <span className="block text-[11px] text-stone">{eta}</span>}
          </dt>
          <dd>{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-[13px] font-medium uppercase tracking-wide">Total</span>
        <div className="text-right">
          <span className="text-xl font-medium">{formatPrice(totals.total)}</span>
          <p className="text-[11px] text-ash">Impuestos incluidos</p>
        </div>
      </div>
    </div>
  );
}
