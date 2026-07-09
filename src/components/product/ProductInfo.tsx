"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ShieldCheck, Truck, RefreshCw, BadgeCheck, Check } from "lucide-react";
import type { Product } from "@/types";
import { Stars } from "@/components/ui/Stars";
import SizeGuide from "./SizeGuide";
import { colorHex } from "@/data/colors";
import { formatPrice, transferPrice, installment, discountPercent } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: ShieldCheck, label: "Compra segura" },
  { icon: Truck, label: "Envío gratis" },
  { icon: BadgeCheck, label: "Garantía" },
  { icon: RefreshCw, label: "Cambios fáciles" },
];

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.id);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const off = discountPercent(product.price, product.compareAtPrice);
  const lowStock = product.stock > 0 && product.stock <= 5;

  const commit = (): boolean => {
    if (!size) {
      setError(true);
      return false;
    }
    setError(false);
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        color,
        size,
        stock: product.stock,
      },
      qty,
    );
    return true;
  };

  const addToCart = () => {
    if (commit()) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }
  };

  const buyNow = () => {
    if (commit()) router.push("/checkout");
  };

  return (
    <div className="flex flex-col">
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Stars rating={product.rating} size={15} />
        <a href="#opiniones" className="text-[13px] text-ash underline-offset-2 hover:underline">
          {product.rating.toFixed(1)} · {product.reviewCount} opiniones
        </a>
      </div>

      <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-ash">{product.category}</p>
      <h1 className="mt-1 font-display text-3xl font-light tracking-tight md:text-4xl">
        {product.name}
      </h1>

      {/* Precio */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-base text-stone line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {off && (
          <span className="bg-accent px-2 py-0.5 text-[11px] font-semibold text-paper">-{off}%</span>
        )}
      </div>
      <p className="mt-2 text-[13px] text-ash">
        <span className="font-medium text-ink-soft">{formatPrice(transferPrice(product.price))}</span>{" "}
        por transferencia · 6 cuotas sin interés de {installment(product.price)}
      </p>

      {/* Color */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2 text-[13px]">
          <span className="font-medium">Color:</span>
          <span className="text-ash">{color}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              aria-pressed={color === c}
              title={c}
              className={cn(
                "h-8 w-8 rounded-full border transition-all",
                color === c ? "border-ink ring-1 ring-ink ring-offset-2" : "border-line hover:border-ash",
              )}
              style={{ backgroundColor: colorHex(c) }}
            />
          ))}
        </div>
      </div>

      {/* Talle */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-medium">Talle</span>
          <SizeGuide />
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError(false);
              }}
              aria-pressed={size === s}
              className={cn(
                "min-w-12 border px-3.5 py-3 text-[13px] transition-colors",
                size === s
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[12px] text-accent"
            >
              Seleccioná un talle para continuar.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Cantidad + stock */}
      <div className="mt-7 flex items-center gap-5">
        <div className="flex items-center border border-line">
          <button
            aria-label="Restar"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-smoke"
          >
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-[14px] tabular-nums">{qty}</span>
          <button
            aria-label="Sumar"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-smoke"
          >
            <Plus size={15} />
          </button>
        </div>
        {lowStock ? (
          <span className="text-[13px] text-accent">Solo quedan {product.stock} unidades</span>
        ) : (
          <span className="flex items-center gap-1.5 text-[13px] text-ash">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> En stock
          </span>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-7 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={addToCart}
            className="relative flex-1 overflow-hidden bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check size={15} strokeWidth={2.5} /> Agregado
                </motion.span>
              ) : (
                <motion.span key="add" exit={{ opacity: 0 }}>
                  Agregar al carrito
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => toggle(product.id)}
            aria-label="Favoritos"
            aria-pressed={fav}
            className="flex h-[52px] w-[52px] items-center justify-center border border-line transition-colors hover:border-ink"
          >
            <Heart size={18} strokeWidth={1.5} className={cn(fav && "fill-accent text-accent")} />
          </button>
        </div>
        <button
          onClick={buyNow}
          className="border border-ink py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
        >
          Comprar ahora
        </button>
      </div>

      {/* Confianza */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-8 sm:grid-cols-4">
        {TRUST.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon size={20} strokeWidth={1.4} className="text-ink-soft" />
            <span className="text-[11px] uppercase tracking-[0.1em] text-ash">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
