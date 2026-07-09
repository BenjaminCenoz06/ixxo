"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [full, setFull] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const go = (dir: number) =>
    setActive((a) => (a + dir + images.length) % images.length);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
      {/* Miniaturas */}
      <div className="flex gap-3 md:flex-col">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Vista ${i + 1}`}
            className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-smoke transition-opacity md:w-20 ${
              active === i ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="relative flex-1">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-smoke"
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setFull(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={name}
                fill
                priority
                sizes="(max-width:768px) 100vw, 45vw"
                className="object-cover transition-transform duration-300"
                style={
                  zoom
                    ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>

          <button
            aria-label="Pantalla completa"
            onClick={(e) => {
              e.stopPropagation();
              setFull(true);
            }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/70 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Expand size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Lightbox fullscreen */}
      <AnimatePresence>
        {full && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFull(false)}
          >
            <button
              aria-label="Cerrar"
              onClick={() => setFull(false)}
              className="absolute right-6 top-6 text-paper/80 hover:text-paper"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Anterior"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-4 text-paper/70 hover:text-paper md:left-10"
            >
              <ChevronLeft size={34} strokeWidth={1.25} />
            </button>
            <div
              className="relative h-[82vh] w-[90vw] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active]} alt={name} fill sizes="90vw" className="object-contain" />
            </div>
            <button
              aria-label="Siguiente"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-4 text-paper/70 hover:text-paper md:right-10"
            >
              <ChevronRight size={34} strokeWidth={1.25} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
