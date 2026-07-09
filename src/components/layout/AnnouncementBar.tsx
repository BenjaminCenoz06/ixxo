"use client";

import { motion } from "framer-motion";

const messages = [
  "Envío gratis en compras superiores a $90.000",
  "Hasta 6 cuotas sin interés",
  "15% OFF pagando por transferencia",
  "Cambios y devoluciones sin cargo",
];

export default function AnnouncementBar() {
  // Duplicamos el set de mensajes varias veces para asegurar un flujo constante y fluido
  const loop = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="relative z-50 overflow-hidden bg-ink py-3 border-b border-paper/5">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {loop.map((msg, i) => (
            <div
              key={i}
              className="flex items-center px-6 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-paper/90"
            >
              <span>{msg}</span>
              <span className="ml-12 text-accent font-bold">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

