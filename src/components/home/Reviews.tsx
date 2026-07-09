"use client";

import { BadgeCheck } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { reviews, reviewStats } from "@/data/reviews";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Reviews() {
  return (
    <section className="bg-smoke py-20 md:py-28">
      <div className="container-ixxo">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_2fr] lg:gap-16">
          {/* Resumen */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-3">Opiniones</p>
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-6xl font-light leading-none">
                {reviewStats.average}
              </span>
              <div className="pb-1">
                <Stars rating={reviewStats.average} size={16} />
                <p className="mt-1 text-sm text-ash">
                  {reviewStats.count.toLocaleString("es-AR")} opiniones
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-1.5">
              {reviewStats.distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-xs text-ash">
                  <span className="w-3">{d.stars}</span>
                  <div className="h-1 flex-1 overflow-hidden bg-mist">
                    <div className="h-full bg-ink" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Grilla de reseñas */}
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <motion.article
                key={r.id}
                variants={revealItem}
                className="flex flex-col border border-line bg-paper p-6"
              >
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
                <Stars rating={r.rating} className="mt-4" />
                <h3 className="mt-3 text-sm font-medium">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{r.body}</p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-stone">
                  {r.product}
                </p>
              </motion.article>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
