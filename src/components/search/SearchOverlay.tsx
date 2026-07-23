"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import Portal from "@/components/ui/Portal";

const POPULAR = ["Remeras", "Camperas", "Jean", "Sweater", "Zapatillas"];

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [productList, setProductList] = useState(products);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductList(data.products);
          }
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const q = normalize(query.trim());

  const results = useMemo(() => {
    if (!q) return [];
    return productList
      .filter((p) => normalize(p.name).includes(q) || normalize(p.category).includes(q))
      .slice(0, 6);
  }, [q, productList]);

  const catMatches = useMemo(() => {
    if (!q) return [];
    return categories.filter((c) => normalize(c.name).includes(q)).slice(0, 4);
  }, [q]);

  return (
    <Portal>
      <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-paper"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container-ixxo flex h-full flex-col">
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-4 border-b border-line py-6">
              <Search size={22} strokeWidth={1.5} className="text-ash" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos, categorías…"
                className="flex-1 bg-transparent font-display text-2xl font-light outline-none placeholder:text-stone md:text-3xl"
              />
              <button
                aria-label="Cerrar"
                onClick={onClose}
                className="flex items-center gap-2 text-[13px] text-ash hover:text-ink"
              >
                Cerrar
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Resultados */}
            <div className="flex-1 overflow-y-auto py-10">
              {!q && (
                <div>
                  <p className="eyebrow mb-5">Búsquedas populares</p>
                  <div className="flex flex-wrap gap-3">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && catMatches.length === 0 && (
                <p className="text-[15px] text-ash">
                  No encontramos resultados para “{query}”. Probá con otra palabra.
                </p>
              )}

              {q && (results.length > 0 || catMatches.length > 0) && (
                <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
                  {/* Sugerencias de categoría */}
                  {catMatches.length > 0 && (
                    <div>
                      <p className="eyebrow mb-4">Categorías</p>
                      <ul className="space-y-2">
                        {catMatches.map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={`/categoria/${c.slug}`}
                              onClick={onClose}
                              className="group inline-flex items-center gap-1.5 text-[15px] text-ink-soft hover:text-ink"
                            >
                              {c.name}
                              <ArrowUpRight
                                size={14}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Productos */}
                  <div>
                    <p className="eyebrow mb-4">Productos</p>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3">
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          href={`/producto/${p.slug}`}
                          onClick={onClose}
                          className="group"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              sizes="200px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <p className="mt-2 text-[13px] leading-snug">{p.name}</p>
                          <p className="text-[13px] text-ash">{formatPrice(p.price)}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </Portal>
  );
}
