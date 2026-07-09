"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ThumbsUp, ChevronDown } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { reviews as allReviews } from "@/data/reviews";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type SortKey = "recent" | "top" | "high" | "low";

export default function ProductReviews({ product }: { product: Product }) {
  const [sort, setSort] = useState<SortKey>("recent");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  // Muestra de reseñas (mock) — en Fase 4 vendrán de la base por producto.
  const base = useMemo(
    () => allReviews.map((r, i) => ({ ...r, likes: 3 + ((i * 5) % 20) })),
    [],
  );

  const sorted = useMemo(() => {
    const list = [...base];
    if (sort === "high") return list.sort((a, b) => b.rating - a.rating);
    if (sort === "low") return list.sort((a, b) => a.rating - b.rating);
    if (sort === "top") return list.sort((a, b) => b.likes - a.likes);
    return list;
  }, [base, sort]);

  const dist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: base.filter((r) => Math.round(r.rating) === stars).length,
  }));
  const total = base.length;

  return (
    <section id="opiniones" className="container-ixxo scroll-mt-28 border-t border-line py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
        {/* Resumen */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-3">Opiniones</p>
          <div className="flex items-end gap-4">
            <span className="font-display text-5xl font-light leading-none">
              {product.rating.toFixed(1)}
            </span>
            <div className="pb-1">
              <Stars rating={product.rating} size={16} />
              <p className="mt-1 text-sm text-ash">{product.reviewCount} opiniones</p>
            </div>
          </div>
          <div className="mt-6 space-y-1.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs text-ash">
                <span className="w-3">{d.stars}</span>
                <div className="h-1 flex-1 overflow-hidden bg-mist">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${total ? (d.count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full border border-ink py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper">
            Escribir opinión
          </button>
        </div>

        {/* Lista */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <span className="text-[13px] text-ash">{total} opiniones</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none border border-line bg-paper py-2 pl-3 pr-8 text-[13px] outline-none focus:border-ink"
                aria-label="Ordenar opiniones"
              >
                <option value="recent">Más recientes</option>
                <option value="top">Más útiles</option>
                <option value="high">Mejor puntuadas</option>
                <option value="low">Peor puntuadas</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ash"
              />
            </div>
          </div>

          <ul className="space-y-8">
            {sorted.map((r) => (
              <li key={r.id} className="border-b border-line pb-8 last:border-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={r.avatar}
                    alt={r.author}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{r.author}</p>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-ash">
                        <BadgeCheck size={12} className="text-ink" /> Compra verificada
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-[11px] text-stone">{r.date}</span>
                </div>
                <Stars rating={r.rating} className="mt-3" />
                <h3 className="mt-2 text-sm font-medium">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ash">{r.body}</p>
                <button
                  onClick={() => setLiked((l) => ({ ...l, [r.id]: !l[r.id] }))}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-ash transition-colors hover:text-ink"
                >
                  <ThumbsUp
                    size={13}
                    strokeWidth={1.5}
                    className={cn(liked[r.id] && "fill-ink text-ink")}
                  />
                  Útil ({r.likes + (liked[r.id] ? 1 : 0)})
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
