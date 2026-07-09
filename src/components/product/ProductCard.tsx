"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import {
  formatPrice,
  transferPrice,
  installment,
  discountPercent,
} from "@/lib/format";
import { colorHex } from "@/data/colors";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { cn } from "@/lib/utils";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.id);

  const off = discountPercent(product.price, product.compareAtPrice);
  const lowStock = product.stock > 0 && product.stock <= 5;

  const quickAdd = () =>
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: product.colors[0],
      size: product.sizes[Math.floor(product.sizes.length / 2)] ?? product.sizes[0],
      stock: product.stock,
    });

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
        <Link href={`/producto/${product.slug}`} aria-label={product.name}>
          {!loaded && <div className="absolute inset-0 skeleton" />}
          {/* Imagen principal */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width:768px) 50vw, 25vw"
            onLoad={() => setLoaded(true)}
            className="object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-0"
          />
          {/* Segunda imagen (hover) */}
          <Image
            src={product.images[1]}
            alt=""
            fill
            aria-hidden
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-100"
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && <Badge>Nuevo</Badge>}
          {off && <Badge accent>-{off}%</Badge>}
          {lowStock && <Badge outline>Últimas {product.stock}</Badge>}
        </div>

        {/* Favorito */}
        <button
          onClick={() => toggle(product.id)}
          aria-label="Agregar a favoritos"
          aria-pressed={fav}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/70 text-ink backdrop-blur-sm transition-all hover:bg-paper hover:scale-110 active:scale-95"
        >
          <Heart size={16} strokeWidth={1.5} className={cn(fav && "fill-accent text-accent")} />
        </button>

        {/* Quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={quickAdd}
            className="flex w-full items-center justify-center gap-2 bg-ink py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
          >
            <Plus size={15} strokeWidth={2} />
            Agregar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ash">{product.category}</p>
        <Link
          href={`/producto/${product.slug}`}
          className="mt-1 text-[15px] font-normal leading-snug text-ink transition-colors hover:text-ash"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-[13px] text-stone line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="mt-1 text-[12px] text-ash">
          <span className="text-ink-soft">{formatPrice(transferPrice(product.price))}</span> por
          transferencia · 6 cuotas de {installment(product.price)}
        </p>

        {/* Swatches */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c}
              className="h-3.5 w-3.5 rounded-full border border-line"
              style={{ backgroundColor: colorHex(c) }}
              title={c}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[11px] text-ash">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </article>
  );
}

function Badge({
  children,
  accent,
  outline,
}: {
  children: React.ReactNode;
  accent?: boolean;
  outline?: boolean;
}) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
        accent && "bg-accent text-paper",
        outline && "border border-ink/15 bg-paper/80 text-ink backdrop-blur-sm",
        !accent && !outline && "bg-ink text-paper",
      )}
    >
      {children}
    </span>
  );
}
