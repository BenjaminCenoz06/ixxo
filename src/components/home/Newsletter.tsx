"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <section className="container-ixxo py-20 md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-4"
        >
          Newsletter
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-display text-3xl font-light leading-tight tracking-tight md:text-5xl"
        >
          Sumate al círculo IXXO
        </motion.h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ash">
          Acceso anticipado a colecciones, ediciones limitadas y 10% en tu primera compra.
        </p>

        <form onSubmit={submit} className="mt-10 w-full max-w-md">
          <div className="relative flex items-center border-b border-ink pb-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={sent}
              className="w-full bg-transparent text-center text-[15px] tracking-wide outline-none placeholder:text-stone md:text-left"
            />
            <button
              type="submit"
              aria-label="Suscribirme"
              disabled={sent}
              className="absolute right-0 flex h-9 w-9 items-center justify-center transition-transform hover:translate-x-0.5 disabled:translate-x-0"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={18} strokeWidth={2} />
                  </motion.span>
                ) : (
                  <motion.span key="go" exit={{ scale: 0 }}>
                    <ArrowRight size={18} strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <AnimatePresence>
            {sent && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-ash"
              >
                ¡Gracias! Revisá tu casilla para confirmar la suscripción.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
