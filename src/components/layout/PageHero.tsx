"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Encabezado de las páginas informativas y legales. Anima en cascada
 * (eyebrow → título → bajada) para que no entren de golpe.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href: string };
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* Halo sutil detrás del título, para que la cabecera no sea un bloque plano */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />

      <div className="container-ixxo relative pb-12 pt-28 md:pb-16 md:pt-36">
        <motion.nav
          className="mb-6 flex items-center gap-1.5 text-[12px] text-ash"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link href="/" className="transition-colors hover:text-ink">
            Inicio
          </Link>
          {breadcrumb && (
            <>
              <ChevronRight size={13} strokeWidth={1.5} />
              <Link href={breadcrumb.href} className="transition-colors hover:text-ink">
                {breadcrumb.label}
              </Link>
            </>
          )}
          <ChevronRight size={13} strokeWidth={1.5} />
          <span className="text-ink-soft">{title}</span>
        </motion.nav>

        <motion.p
          className="eyebrow mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.14, ease: EASE }}
        >
          {title}
        </motion.h1>

        {intro && (
          <motion.p
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-ash"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
