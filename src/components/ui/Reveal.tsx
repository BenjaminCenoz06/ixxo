"use client";

import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  blur?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}

/**
 * Reveal editorial: fundido + desplazamiento corto al entrar en viewport.
 *
 * Se anima con clases CSS (ver `.reveal` en globals.css) y no con
 * framer-motion. Framer escribe los estilos iniciales durante el render del
 * servidor y los corrige en el cliente al leer la preferencia de "reducir
 * movimiento", lo que provocaba doce errores de hidratación por página. Acá
 * el marcado del servidor y el del cliente son idénticos y el JS solo agrega
 * `is-in` cuando el elemento aparece.
 *
 * El salto vertical según ancho de pantalla también se resolvió en CSS, así
 * que ya no hace falta un matchMedia en JS.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  blur = true,
  as = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  // El tag es variable (div, section, li, span, article) y cada uno tiene su
  // propio tipo de ref: TypeScript los intersecta y ninguno encaja. Con
  // ElementType el ref queda genérico.
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-dir={direction}
      data-blur={blur ? "1" : "0"}
      // El delay en línea es determinista: da igual en servidor y cliente.
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn("reveal", inView && "is-in", className)}
    >
      {children}
    </Tag>
  );
}

/**
 * Contenedor con stagger. Los hijos escalonan por CSS con `--i`; se mantiene
 * el nombre y la firma para no tocar los llamados existentes.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ ["--stagger" as string]: `${stagger}s` }}
      className={cn("reveal-group", inView && "is-in", className)}
    >
      {children}
    </div>
  );
}
