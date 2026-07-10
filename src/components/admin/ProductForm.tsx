"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "@/types";
import { categories } from "@/data/categories";
import { COLORS, colorHex } from "@/data/colors";
import { newProductId } from "@/lib/admin-data";
import { Btn } from "./ui";
import { cn } from "@/lib/utils";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({
  product,
  onSave,
  onClose,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const isNew = !product;
  const [name, setName] = useState(product?.name ?? "");
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug ?? categories[0].slug);
  const [price, setPrice] = useState(product?.price ?? 0);
  const [compareAt, setCompareAt] = useState(product?.compareAtPrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [isNewFlag, setIsNewFlag] = useState(product?.isNew ?? false);
  const [collection, setCollection] = useState(product?.collection ?? "");
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(", "));
  const [img1, setImg1] = useState(product?.images[0] ?? "");
  const [img2, setImg2] = useState(product?.images[1] ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [error, setError] = useState("");

  const toggleColor = (c: string) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const save = () => {
    if (!name.trim() || price <= 0) {
      setError("Completá al menos nombre y precio.");
      return;
    }
    const cat = categories.find((c) => c.slug === categorySlug)!;
    const sizeList = sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const images: Product["images"] = [
      img1 || "https://picsum.photos/seed/ixxo-new/900/1200?grayscale",
      img2 || img1 || "https://picsum.photos/seed/ixxo-new/900/1200?grayscale",
    ];
    onSave({
      id: product?.id ?? newProductId(),
      slug: product?.slug ?? slugify(name),
      name: name.trim(),
      category: cat.name,
      categorySlug,
      price,
      compareAtPrice: compareAt > 0 ? compareAt : undefined,
      images,
      colors: colors.length ? colors : ["Negro"],
      sizes: sizeList.length ? sizeList : ["Único"],
      stock,
      isNew: isNewFlag,
      collection: collection || undefined,
      rating: product?.rating ?? 5,
      reviewCount: product?.reviewCount ?? 0,
      description: description || undefined,
      materials: product?.materials,
      care: product?.care,
    });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-paper"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg">{isNew ? "Nuevo producto" : "Editar producto"}</h2>
          <button aria-label="Cerrar" onClick={onClose}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <Field label="Nombre">
            <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría">
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className={cn(input, "bg-paper")}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Colección (opcional)">
              <input value={collection} onChange={(e) => setCollection(e.target.value)} className={input} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Precio">
              <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className={input} />
            </Field>
            <Field label="Precio tachado">
              <input type="number" value={compareAt} onChange={(e) => setCompareAt(+e.target.value)} className={input} />
            </Field>
            <Field label="Stock">
              <input type="number" value={stock} onChange={(e) => setStock(+e.target.value)} className={input} />
            </Field>
          </div>

          <Field label="Colores">
            <div className="flex flex-wrap gap-2">
              {Object.keys(COLORS).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full border transition-all",
                    colors.includes(c) ? "border-ink ring-1 ring-ink ring-offset-2" : "border-line",
                  )}
                  style={{ backgroundColor: colorHex(c) }}
                  title={c}
                />
              ))}
            </div>
          </Field>

          <Field label="Talles (separados por coma)">
            <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" className={input} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Imagen frontal (URL)">
              <input value={img1} onChange={(e) => setImg1(e.target.value)} className={input} />
            </Field>
            <Field label="Imagen hover (URL)">
              <input value={img2} onChange={(e) => setImg2(e.target.value)} className={input} />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={cn(input, "resize-none")} />
          </Field>

          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={isNewFlag} onChange={(e) => setIsNewFlag(e.target.checked)} />
            Marcar como “Nuevo”
          </label>

          {error && <p className="text-[13px] text-accent">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-line px-6 py-4">
          <Btn variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Btn>
          <Btn onClick={save} className="flex-[2]">
            {isNew ? "Crear producto" : "Guardar cambios"}
          </Btn>
        </div>
      </motion.aside>
    </>
  );
}

const input =
  "w-full border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
