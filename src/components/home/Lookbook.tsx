"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/lib/site-content-context";

export default function Lookbook() {
  const { sections, lookbook } = useSiteContent();
  const heading = sections.lookbook;
  const looks = lookbook.looks;

  return (
    <section className="container-ixxo py-20 md:py-28">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        cta={heading.ctaLabel}
        ctaHref={heading.ctaHref}
      />
      <div className="mt-12 grid gap-4 md:gap-5 lg:grid-cols-2 lg:grid-rows-2">
        {looks.map((look, i) => (
          <Reveal
            key={i}
            blur={false}
            className={i === 0 ? "lg:row-span-2 aspect-[3/4] lg:aspect-auto" : "aspect-[4/3]"}
          >
            <div className="group relative h-full min-h-[300px] overflow-hidden bg-smoke">
              {look.image && (
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  priority={i === 0}
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-paper">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-paper/70">
                    {look.items} prendas
                  </p>
                  <h3 className="mt-1 font-display text-xl font-normal md:text-2xl">{look.title}</h3>
                </div>
                <Link
                  href={heading.ctaHref}
                  className="flex translate-y-2 items-center gap-2 bg-paper px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ShoppingBag size={14} strokeWidth={1.75} />
                  Comprar el look
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
