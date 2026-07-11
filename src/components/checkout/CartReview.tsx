"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, Tag, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSiteContent } from "@/lib/site-content-context";
import { formatPrice } from "@/lib/format";
import { colorHex } from "@/data/colors";

export default function CartReview({ onContinue }: { onContinue: () => void }) {
  const { items, setQty, removeItem, coupon, applyCoupon, removeCoupon } = useCart();
  const { coupons } = useSiteContent();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = applyCoupon(code, coupons);
    setError(!ok);
    if (ok) setCode("");
  };

  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.lineId} className="flex gap-4 py-6">
            <Link
              href={`/producto/${item.slug}`}
              className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-smoke"
            >
              <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/producto/${item.slug}`} className="text-[15px] hover:text-ash">
                    {item.name}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-[12px] text-ash">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-line"
                      style={{ backgroundColor: colorHex(item.color) }}
                    />
                    {item.color} · Talle {item.size}
                  </p>
                </div>
                <button
                  aria-label="Eliminar"
                  onClick={() => removeItem(item.lineId)}
                  className="text-stone transition-colors hover:text-accent"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center border border-line">
                  <button
                    aria-label="Restar"
                    onClick={() => setQty(item.lineId, item.qty - 1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-smoke"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-[13px] tabular-nums">{item.qty}</span>
                  <button
                    aria-label="Sumar"
                    onClick={() => setQty(item.lineId, item.qty + 1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-smoke"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-[15px] font-medium">{formatPrice(item.price * item.qty)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Cupón */}
      <div className="mt-6">
        {coupon ? (
          <div className="flex items-center justify-between bg-smoke px-4 py-3 text-[13px]">
            <span className="flex items-center gap-2">
              <Tag size={15} /> {coupon.code} — {coupon.label}
            </span>
            <button onClick={removeCoupon} aria-label="Quitar cupón">
              <X size={16} className="text-ash hover:text-ink" />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex max-w-sm gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="Código de descuento"
              className="flex-1 border border-line px-4 py-3 text-[13px] outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="border border-ink px-5 text-[12px] font-medium uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper"
            >
              Aplicar
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-[12px] text-accent">Código inválido.</p>}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link href="/prendas" className="text-[13px] text-ash hover:text-ink">
          Seguir comprando
        </Link>
        <button
          onClick={onContinue}
          className="group inline-flex items-center gap-2 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
        >
          Continuar a entrega
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
