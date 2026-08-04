"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/**
 * Encabezado de sección.
 *
 * El título va en la serif del logotipo (Fraunces) y no en la grotesca del
 * cuerpo: es lo que le da voz propia a la página en vez de leerse como una
 * plantilla. Peso liviano y tracking cerrado para que el carácter venga de la
 * forma de la letra, no del grosor.
 *
 * La animación es un revelado por máscara: la línea sube desde detrás del
 * borde del contenedor. Es EL gesto de movimiento de la página; el resto de
 * las secciones usa un fundido corto para que este destaque. Se anima con
 * clases CSS (ver `.mask-line` en globals.css) y no con framer-motion, porque
 * framer escribe el transform inicial en el HTML del servidor y lo corrige en
 * el cliente al leer "reducir movimiento", rompiendo la hidratación.
 */
export function SectionHeading({
  eyebrow,
  title,
  cta,
  ctaHref = "#",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  cta?: string;
  ctaHref?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        {/*
          El padding-bottom da aire a las colas de la g y la y, que en esta
          serif bajan bastante y el overflow les cortaría la punta.
        */}
        <h2 ref={ref} className="max-w-2xl overflow-hidden pb-[0.12em]">
          <span
            className={cn(
              "mask-line font-brand text-[2rem] font-light leading-[1.02] tracking-[-0.02em] md:text-[3.25rem]",
              inView && "is-in",
            )}
          >
            {title}
          </span>
        </h2>
      </div>
      {cta && (
        <Reveal delay={0.1} blur={false}>
          <Link
            href={ctaHref}
            className="group link-underline inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.16em] text-ink"
          >
            {cta}
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
