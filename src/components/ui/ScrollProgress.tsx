"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Barra de progreso de lectura, pegada al borde superior. Da sensación de
 * avance en las páginas largas (catálogo, legales) sin ocupar lugar.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[95] h-0.5 origin-left bg-accent"
    />
  );
}
