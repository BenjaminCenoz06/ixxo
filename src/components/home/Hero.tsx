"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { hero } = useSiteContent();
  const slides = hero.slides;
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-scrim">
      {/* Slides con crossfade + Ken Burns */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 animate-kenburns">
              {slides[index].imageMobile ? (
                <>
                  {/* Móvil: imagen con encuadre vertical */}
                  <Image
                    src={slides[index].imageMobile as string}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover md:hidden"
                  />
                  {/* Tablet / escritorio */}
                  <Image
                    src={slides[index].image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="hidden object-cover md:block"
                  />
                </>
              ) : (
                <Image
                  src={slides[index].image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-scrim/45 via-scrim/10 to-scrim/40" />
      {/* Base oscura bajo el bloque de texto: la foto queda limpia arriba y el
          copy siempre apoya sobre algo oscuro, incluso con cielos claros */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-scrim/85 via-scrim/45 to-transparent" />
      <div className="absolute inset-0 bg-scrim/10" />

      {/* Contenido */}
      <motion.div
        style={{ opacity }}
        className="container-ixxo relative flex h-full flex-col justify-end pb-[12vh] text-onmedia"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={slides[index].eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-onmedia/80"
          >
            {slides[index].eyebrow}
          </motion.p>
        </AnimatePresence>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          className="max-w-4xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-light leading-[0.95] tracking-[-0.02em]"
        >
          {hero.titleTop}
          <br />
          <span className="italic font-extralight">{hero.titleBottom}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={hero.ctaPrimaryHref}
            className="group inline-flex w-full items-center justify-center bg-onmedia px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-scrim transition-all duration-300 hover:bg-onmedia/90 sm:w-auto"
          >
            {hero.ctaPrimaryLabel}
          </Link>
          <Link
            href={hero.ctaSecondaryHref}
            className="inline-flex w-full items-center justify-center border border-onmedia/40 px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-onmedia backdrop-blur-sm transition-all duration-300 hover:bg-onmedia hover:text-scrim sm:w-auto"
          >
            {hero.ctaSecondaryLabel}
          </Link>
        </motion.div>

        {/* Indicadores de slide */}
        <div className="mt-12 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-0.5 w-8 overflow-hidden bg-onmedia/25"
            >
              <span
                className={`block h-full bg-onmedia transition-transform duration-500 ${
                  i === index ? "translate-x-0" : "-translate-x-full"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-onmedia/40 p-1">
          <span className="h-1.5 w-1.5 animate-scroll-hint rounded-full bg-onmedia" />
        </div>
      </div>
    </section>
  );
}
