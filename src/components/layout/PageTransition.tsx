"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Transición entre rutas. Sin `AnimatePresence` a propósito: esperar la salida
 * de la página anterior retrasa la entrada de la nueva y se siente lento.
 * Remontamos por `key` y solo animamos la entrada.
 *
 * Respeta `prefers-reduced-motion` vía la media query de globals.css, que anula
 * la animación para quien la tenga desactivada.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.main
      id="contenido"
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
