"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Ruler } from "lucide-react";

const rows = [
  { size: "XS", chest: "86–90", waist: "72–76", length: "68" },
  { size: "S", chest: "90–96", waist: "76–82", length: "70" },
  { size: "M", chest: "96–102", waist: "82–88", length: "72" },
  { size: "L", chest: "102–108", waist: "88–94", length: "74" },
  { size: "XL", chest: "108–114", waist: "94–100", length: "76" },
  { size: "XXL", chest: "114–120", waist: "100–106", length: "78" },
];

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
              className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm"
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
                dos talles, recomendamos elegir el mayor para un calce relajado.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
