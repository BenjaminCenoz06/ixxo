"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/lib/site-content-context";

export default function Editorial() {
  const { editorial: c } = useSiteContent();
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-paper">
      <Image src={c.image} alt="" fill sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="container-ixxo relative py-28 text-center">
        <Reveal>
          <p className="eyebrow mb-6 text-paper/60">{c.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.75rem)] font-light leading-[1.1] tracking-tight">
            {c.quote}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-paper/70">{c.subtext}</p>
        </Reveal>
      </div>
    </section>
  );
}
