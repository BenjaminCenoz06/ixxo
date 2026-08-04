"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Avisa cuando el elemento entra en pantalla, una sola vez.
 *
 * Existe para animar con clases CSS en vez de con estilos en línea: los
 * componentes de framer-motion escriben el transform inicial durante el
 * render del servidor y lo corrigen en el cliente al leer la preferencia de
 * "reducir movimiento", lo que rompe la hidratación. Acá el marcado inicial
 * es igual en los dos lados y la clase se agrega después de montar.
 */
export function useInView<T extends HTMLElement>(margin = "-80px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sin IntersectionObserver (o si ya pasó), mostrar sin animar.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, inView };
}
