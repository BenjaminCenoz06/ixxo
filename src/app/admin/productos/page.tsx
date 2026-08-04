"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useAdminProducts } from "@/lib/admin-data";
import { PageHeader, Btn } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AdminProductos() {
  const { items, error, upsert, remove } = useAdminProducts();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [falla, setFalla] = useState<string | null>(null);

  // El formulario se cierra solo si la base confirmó el guardado.
  const guardar = async (p: Product) => {
    setFalla(null);
    const r = await upsert(p);
    if (!r.ok) {
      setFalla(r.error ?? "No se pudo guardar el producto.");
      return;
    }
    setEditing(null);
    setCreating(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  const formOpen = creating || !!editing;

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={`${items.length} productos en el catálogo`}
        action={
          <Btn onClick={() => setCreating(true)}>
            <Plus size={15} /> Nuevo producto
          </Btn>
        }
      />

      {(error || falla) && (
        <div className="mb-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
          {error ?? falla}
        </div>
      )}

      {/* Buscador */}
      <div className="mb-6 flex items-center gap-2 border border-line bg-paper px-4 py-2.5">
        <Search size={16} className="text-ash" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o categoría…"
          className="w-full bg-transparent text-[14px] outline-none"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[720px] text-[13px]">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-smoke/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-smoke">
                      <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      {p.isNew && <span className="text-[10px] uppercase tracking-wide text-ash">Nuevo</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash">{p.category}</td>
                <td className="px-4 py-3">
                  {formatPrice(p.price)}
                  {p.compareAtPrice && (
                    <span className="ml-1 text-[11px] text-stone line-through">
                      {formatPrice(p.compareAtPrice)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-medium",
                      p.stock === 0 ? "text-accent" : p.stock <= 5 ? "text-amber-600" : "text-ink",
                    )}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      aria-label="Editar"
                      className="p-1.5 text-ash transition-colors hover:text-ink"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p)}
                      aria-label="Eliminar"
                      className="p-1.5 text-ash transition-colors hover:text-accent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ash">
                  No hay productos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario slide-over */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            product={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSave={guardar}
          />
        )}
      </AnimatePresence>

      {/* Confirmar borrado */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <div
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              onClick={() => setConfirmDelete(null)}
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-paper p-6 text-center">
              <Trash2 size={28} strokeWidth={1.3} className="mx-auto text-accent" />
              <p className="mt-4 font-display text-lg">¿Eliminar “{confirmDelete.name}”?</p>
              <p className="mt-1 text-[13px] text-ash">Esta acción no se puede deshacer.</p>
              <div className="mt-6 flex gap-3">
                <Btn variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1">
                  Cancelar
                </Btn>
                <Btn
                  variant="danger"
                  onClick={async () => {
                    const r = await remove(confirmDelete.id);
                    if (!r.ok) setFalla(r.error ?? "No se pudo eliminar.");
                    setConfirmDelete(null);
                  }}
                  className="flex-1"
                >
                  Eliminar
                </Btn>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
