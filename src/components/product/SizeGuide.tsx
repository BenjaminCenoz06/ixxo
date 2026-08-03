"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Ruler } from "lucide-react";
import { TOP_SIZES as rows } from "@/data/sizes";

export default function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[12px] text-ash underline underline-offset-2 transition-colors hover:text-ink"
      >
        <Ruler size={13} strokeWidth={1.5} />
        Guía de talles
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-scrim/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Guía de talles"
              className="fixed left-1/2 top-1/2 z-[91] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-paper p-8"
              initial={{ opacity: 0, scale: 0.96, y: "-46%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="eyebrow mb-1">Guía de talles</p>
                  <h3 className="font-display text-xl">Medidas en centímetros</h3>
                </div>
                <button aria-label="Cerrar" onClick={() => setOpen(false)}>
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink text-left">
                    <th className="py-2.5 font-medium">Talle</th>
                    <th className="py-2.5 font-medium">Pecho</th>
                    <th className="py-2.5 font-medium">Cintura</th>
                    <th className="py-2.5 font-medium">Largo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((r) => (
                    <tr key={r.size}>
                      <td className="py-2.5 font-medium">{r.size}</td>
                      <td className="py-2.5 text-ash">{r.chest}</td>
                      <td className="py-2.5 text-ash">{r.waist}</td>
                      <td className="py-2.5 text-ash">{r.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-6 text-[12px] leading-relaxed text-ash">
                Las medidas son aproximadas y pueden variar ±2 cm según la prenda. Ante la duda entre
                dos talles, recomendamos elegir el mayor para un calce relajado.{" "}
                <Link href="/ayuda/talles" className="text-ink underline underline-offset-2">
                  Ver la guía completa
                </Link>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
