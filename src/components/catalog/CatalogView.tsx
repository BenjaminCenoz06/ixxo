"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { Product } from "@/types";
import {
  applyFilters,
  computeFacets,
  countActive,
  emptyFilters,
  sortProducts,
  SORT_OPTIONS,
  type Filters,
  type SortKey,
} from "@/lib/catalog";
import ProductCard from "@/components/product/ProductCard";
import FilterControls from "./FilterControls";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  title: string;
  eyebrow?: string;
  description?: string;
}

export default function CatalogView({ products, title, eyebrow, description }: Props) {
  const facets = useMemo(() => computeFacets(products), [products]);
  const [filters, setFilters] = useState<Filters>(() => emptyFilters(facets));
  const [sort, setSort] = useState<SortKey>("relevance");
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(
    () => sortProducts(applyFilters(products, filters), sort),
    [products, filters, sort],
  );

  const active = countActive(filters, facets);
  const clear = () => setFilters(emptyFilters(facets));

  return (
    <div className="container-ixxo pb-24 pt-28 md:pt-36">
      {/* Encabezado */}
      <header className="border-b border-line pb-8">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-[15px] text-ash">{description}</p>}
      </header>

      <div className="flex gap-10 pt-8">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow">Filtros</span>
              {active > 0 && (
                <button onClick={clear} className="text-[12px] text-ash underline hover:text-ink">
                  Limpiar ({active})
                </button>
              )}
            </div>
            <FilterControls facets={facets} filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          {/* Barra de acciones */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="text-[13px] text-ash">
              {results.length} {results.length === 1 ? "producto" : "productos"}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSheetOpen(true)}
                className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[13px] lg:hidden"
              >
                <SlidersHorizontal size={15} strokeWidth={1.75} />
                Filtrar
                {active > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-paper">
                    {active}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none border border-line bg-paper py-2.5 pl-4 pr-9 text-[13px] outline-none focus:border-ink"
                  aria-label="Ordenar"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ash"
                />
              </div>
            </div>
          </div>

          {/* Grilla */}
          {results.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6"
            >
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={p} priority={i < 6} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <p className="font-display text-2xl font-light">Sin resultados</p>
              <p className="mt-2 text-sm text-ash">
                Probá ajustar o quitar algunos filtros.
              </p>
              <button
                onClick={clear}
                className="mt-6 border border-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom sheet mobile */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-paper lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="font-display text-lg">Filtros</span>
                <button aria-label="Cerrar" onClick={() => setSheetOpen(false)}>
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-2">
                <FilterControls facets={facets} filters={filters} onChange={setFilters} />
              </div>
              <div className="flex gap-3 border-t border-line px-6 py-4">
                <button
                  onClick={clear}
                  className="flex-1 border border-line py-3.5 text-[13px] font-medium uppercase tracking-[0.14em]"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex-[2] bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] text-paper"
                >
                  Ver {results.length} productos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
