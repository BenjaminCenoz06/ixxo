"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

/**
 * En pantallas chicas el layout apila en una sola columna, así que un slide
 * horizontal en un elemento pegado al borde asoma unos px fuera del viewport.
 * Debajo de 1024px convertimos left/right en un desplazamiento vertical:
 * se conserva la animación (fade + movimiento) sin generar scroll horizontal.
 */
function useResponsiveDirection(direction: Direction): Direction {
  // Mobile-first: arranca en false para que el render inicial (y el móvil)
  // nunca use desplazamiento horizontal; en escritorio se activa al montar.
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (isWide || (direction !== "left" && direction !== "right")) return direction;
  return "up";
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  blur?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}

/** Reveal editorial: fade + desplazamiento + blur suave al entrar en viewport. */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  blur = true,
  as = "div",
}: RevealProps) {
  const effectiveDirection = useResponsiveDirection(direction);
  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? "blur(8px)" : "blur(0px)",
      ...offset[effectiveDirection],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Contenedor con stagger para revelar hijos en secuencia. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
