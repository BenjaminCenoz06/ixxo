"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, Btn } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  useAdminCollections,
  slugify,
  type AdminCollection,
} from "@/lib/admin-catalog-meta";
import { FormSheet, LabeledInput, LabeledTextarea, ConfirmDelete } from "@/components/admin/FormSheet";

export default function AdminColecciones() {
  const { items, upsert, remove } = useAdminCollections();
  const [editing, setEditing] = useState<AdminCollection | null>(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<AdminCollection | null>(null);

  const startNew = () => {
    setEditing({ slug: "", title: "", subtitle: "", image: "" });
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Colecciones"
        subtitle={`${items.length} colecciones`}
        action={
          <Btn onClick={startNew}>
            <Plus size={15} /> Nueva colección
          </Btn>
        }
      />

      <div className="space-y-4">
        {items.map((c) => (
          <div key={c.id ?? c.slug} className="flex gap-5 border border-line bg-paper p-4">
            <div className="relative aspect-[16/10] w-48 shrink-0 overflow-hidden bg-smoke">
              {c.image && <Image src={c.image} alt={c.title} fill sizes="192px" className="object-cover" unoptimized />}
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-display text-lg">{c.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-ash">/{c.slug}</p>
              <p className="mt-2 max-w-md text-[13px] text-ash">{c.subtitle}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditing(c); setOpen(true); }} className="border border-line p-2 hover:border-ink" aria-label="Editar">
                <Pencil size={15} />
              </button>
              <button onClick={() => setConfirm(c)} className="border border-line p-2 text-accent hover:border-accent" aria-label="Eliminar">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && editing && (
          <FormSheet
            title={editing.id ? "Editar colección" : "Nueva colección"}
            onClose={() => setOpen(false)}
            onSave={() => {
              upsert({ ...editing, slug: editing.slug || slugify(editing.title) });
              setOpen(false);
            }}
          >
            <LabeledInput label="Título" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v, slug: editing.slug || slugify(v) })} />
            <LabeledInput label="Slug (URL)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: slugify(v) })} />
            <LabeledTextarea label="Subtítulo" value={editing.subtitle ?? ""} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <div>
              <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">Imagen</span>
              <ImageUploader folder="colecciones" value={editing.image ?? ""} onChange={(v) => setEditing({ ...editing, image: v })} />
            </div>
          </FormSheet>
        )}
      </AnimatePresence>

      <ConfirmDelete
        item={confirm}
        label={confirm?.title}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) remove(confirm);
          setConfirm(null);
        }}
      />
    </>
  );
}
