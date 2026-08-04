"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

export default function Newsletter() {
  const { newsletter: c } = useSiteContent();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Antes esto solo ponía sent=true: el mail no se guardaba en ningún lado y
  // igual se le decía al cliente que revisara su casilla.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo guardar");
      }
      setSent(true);
    } catch {
      setError("No pudimos registrarte. Probá de nuevo en un rato.");
    }
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
          {c.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-display text-3xl font-light leading-tight tracking-tight md:text-5xl"
        >
          {c.title}
        </motion.h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ash">{c.subtitle}</p>

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
                ¡Listo! Te vamos a avisar cuando entren prendas nuevas.
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-accent"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
