"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/lib/site-content-context";

export default function NewCollection() {
  const { newCollection: c } = useSiteContent();
  return (
    <section className="container-ixxo py-20 md:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="right" className="order-2 lg:order-1">
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2 className="font-display text-4xl font-light leading-[1.02] tracking-tight md:text-6xl">
            {c.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ash">{c.description}</p>
          <Link
            href={c.ctaHref}
            className="group mt-9 inline-flex items-center gap-2 border-b border-ink pb-1 text-[13px] font-medium uppercase tracking-[0.18em]"
          >
            {c.ctaLabel}
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        <Reveal direction="left" className="order-1 lg:order-2" blur={false}>
          <div className="relative aspect-[4/5] overflow-hidden bg-smoke md:aspect-[5/6]">
            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
