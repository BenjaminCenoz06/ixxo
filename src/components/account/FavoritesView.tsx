"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function FavoritesView() {
  const { ids } = useFavorites();
  const favProducts = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-ixxo pb-24 pt-28 md:pt-36">
      <header className="border-b border-line pb-8">
        <p className="eyebrow mb-3">Tu selección</p>
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">Favoritos</h1>
        <p className="mt-2 text-sm text-ash">
          {favProducts.length} {favProducts.length === 1 ? "producto guardado" : "productos guardados"}
        </p>
      </header>

      {favProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {favProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <Heart size={40} strokeWidth={1} className="text-stone" />
          <p className="mt-5 font-display text-2xl font-light">Todavía no tenés favoritos</p>
          <p className="mt-2 text-sm text-ash">
            Tocá el corazón en cualquier producto para guardarlo acá.
          </p>
          <Link
            href="/prendas"
            className="mt-8 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
          >
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
