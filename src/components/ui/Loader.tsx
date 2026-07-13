"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Intro de carga: escribe el nombre de la marca letra por letra y deja el
 * punto final parpadeando como un cursor ("por escribir más") antes de entrar
 * a la página. Usa el nombre real del CMS (general.storeName).
 */
export default function Loader() {
  const { general } = useSiteContent();
  const [done, setDone] = useState(false);

  // Separa el nombre del punto final: "CUSTOM WEAR." -> base "CUSTOM WEAR" + "."
  const { base, dot } = useMemo(() => {
    const name = (general.storeName || "CUSTOM WEAR.").trim();
    return name.endsWith(".")
      ? { base: name.slice(0, -1).trimEnd(), dot: "." }
      : { base: name, dot: "." };
  }, [general.storeName]);

  const letters = useMemo(() => [...base], [base]);

  // Tiempos: escritura de las letras + parpadeo del cursor
  const writeDelay = 0.25;
  const perLetter = 0.055;
  const dotStart = writeDelay + letters.length * perLetter + 0.15;

  useEffect(() => {
    const totalMs = (dotStart + 1.15) * 1000;
    const t = setTimeout(() => setDone(true), totalMs);
    return () => clearTimeout(t);
  }, [dotStart]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-paper px-6"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex items-baseline font-display text-[clamp(1.5rem,6vw,2.75rem)] font-medium tracking-[0.3em] text-ink">
            <span className="flex" aria-label={base}>
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: writeDelay + i * perLetter, duration: 0.35, ease: EASE }}
                  className={ch === " " ? "inline-block w-[0.35em]" : ""}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </span>
            {/* El punto hace de cursor: parpadea como si fuera a seguir escribiendo */}
            <motion.span
              aria-hidden
              className="text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{
                delay: dotStart,
                duration: 1.1,
                ease: "linear",
                times: [0, 0.16, 0.36, 0.56, 0.76, 1],
              }}
            >
              {dot}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
