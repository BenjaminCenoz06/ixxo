"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, Btn } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";
import { FormSheet, LabeledInput, ConfirmDelete } from "@/components/admin/FormSheet";
import {
  useAdminCategories,
  slugify,
  type AdminCategory,
} from "@/lib/admin-catalog-meta";

export default function AdminCategorias() {
  const { items, error, upsert, remove } = useAdminCategories();
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<AdminCategory | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [falla, setFalla] = useState<string | null>(null);

  // El formulario se cierra solo si el servidor confirmó. Antes se cerraba
  // siempre y una escritura rechazada pasaba por guardada.
  const guardar = async () => {
    if (!editing) return;
    setGuardando(true);
    setFalla(null);
    const r = await upsert({ ...editing, slug: editing.slug || slugify(editing.name) });
    setGuardando(false);
    if (r.ok) setOpen(false);
    else setFalla(r.error ?? "No se pudo guardar.");
  };

  const startNew = () => {
    setEditing({ slug: "", name: "", image: "", sort: items.length });
    setOpen(true);
  };
  const startEdit = (c: AdminCategory) => {
    setEditing(c);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Categorías"
        subtitle={`${items.length} categorías`}
        action={
          <Btn onClick={startNew}>
            <Plus size={15} /> Nueva categoría
          </Btn>
        }
      />

      {(error || falla) && (
        <div className="mb-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
          {error ?? falla}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <div key={c.id ?? c.slug} className="group border border-line bg-paper">
            <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
              {c.image && <Image src={c.image} alt={c.name} fill sizes="240px" className="object-cover" unoptimized />}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                <button onClick={() => startEdit(c)} className="rounded-full bg-paper p-2" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setConfirm(c)} className="rounded-full bg-paper p-2 text-accent" aria-label="Eliminar">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[14px] font-medium">{c.name}</p>
              <p className="text-[11px] text-ash">/{c.slug}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && editing && (
          <FormSheet
            title={editing.id ? "Editar categoría" : "Nueva categoría"}
            onClose={() => setOpen(false)}
            onSave={guardar}
            saving={guardando}
          >
            {falla && (
              <p className="border-l-2 border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
                {falla}
              </p>
            )}
            <LabeledInput label="Nombre" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v, slug: editing.slug || slugify(v) })} />
            <LabeledInput label="Slug (URL)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: slugify(v) })} />
            <div>
              <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">Imagen</span>
              <ImageUploader folder="categorias" value={editing.image ?? ""} onChange={(v) => setEditing({ ...editing, image: v })} />
            </div>
          </FormSheet>
        )}
      </AnimatePresence>

      <ConfirmDelete
        item={confirm}
        label={confirm?.name}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          if (confirm) {
            const r = await remove(confirm);
            if (!r.ok) setFalla(r.error ?? "No se pudo eliminar.");
          }
          setConfirm(null);
        }}
      />
    </>
  );
}
