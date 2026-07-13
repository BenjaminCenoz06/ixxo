"use client";

import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { Btn } from "./ui";
import type { NavItemContent } from "@/lib/site-content";

const cls = "w-full border border-line px-2.5 py-2 text-[13px] outline-none focus:border-ink";

export default function NavEditor({
  nav,
  onChange,
}: {
  nav: NavItemContent[];
  onChange: (v: NavItemContent[]) => void;
}) {
  /** Aplica una mutación sobre una copia y notifica. */
  const set = (fn: (draft: NavItemContent[]) => void) => {
    const draft = structuredClone(nav);
    fn(draft);
    onChange(draft);
  };
  const emptyFeatured = { title: "", image: "", href: "" };

  return (
    <div className="space-y-4">
      {nav.map((item, i) => (
        <div key={i} className="space-y-3 border border-line p-3">
          <div className="flex items-center gap-2">
            <input value={item.label} placeholder="Nombre" className={cls} onChange={(e) => set((d) => { d[i].label = e.target.value; })} />
            <input value={item.href} placeholder="/link" className={`${cls} max-w-32`} onChange={(e) => set((d) => { d[i].href = e.target.value; })} />
            <button onClick={() => set((d) => { d.splice(i, 1); })} className="shrink-0 p-1.5 text-stone hover:text-accent" aria-label="Eliminar">
              <Trash2 size={15} />
            </button>
          </div>

          {item.mega ? (
            <div className="space-y-3 border-l-2 border-line pl-3">
              <p className="text-[11px] uppercase tracking-wide text-ash">Mega-menú (columnas)</p>
              {item.mega.map((col, ci) => (
                <div key={ci} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input value={col.heading} placeholder="Título de columna" className={cls} onChange={(e) => set((d) => { d[i].mega![ci].heading = e.target.value; })} />
                    <button onClick={() => set((d) => { d[i].mega!.splice(ci, 1); })} className="shrink-0 p-1 text-stone hover:text-accent" aria-label="Eliminar columna">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {col.links.map((l, li) => (
                    <div key={li} className="flex items-center gap-1.5 pl-3">
                      <input value={l.label} placeholder="Texto" className={cls} onChange={(e) => set((d) => { d[i].mega![ci].links[li].label = e.target.value; })} />
                      <input value={l.href} placeholder="/link" className={`${cls} max-w-28`} onChange={(e) => set((d) => { d[i].mega![ci].links[li].href = e.target.value; })} />
                      <button onClick={() => set((d) => { d[i].mega![ci].links.splice(li, 1); })} className="shrink-0 p-1 text-stone hover:text-accent" aria-label="Eliminar enlace">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => set((d) => { d[i].mega![ci].links.push({ label: "Nuevo", href: "#" }); })} className="pl-3 text-[12px] text-ash hover:text-ink">
                    + enlace
                  </button>
                </div>
              ))}
              <button onClick={() => set((d) => { d[i].mega!.push({ heading: "Columna", links: [] }); })} className="text-[12px] text-ash hover:text-ink">
                + columna
              </button>

              <div className="space-y-2 border-t border-line pt-2">
                <p className="text-[11px] uppercase tracking-wide text-ash">Imagen destacada</p>
                <input value={item.featured?.title ?? ""} placeholder="Título" className={cls} onChange={(e) => set((d) => { d[i].featured = { ...(d[i].featured ?? emptyFeatured), title: e.target.value }; })} />
                <input value={item.featured?.href ?? ""} placeholder="/link" className={cls} onChange={(e) => set((d) => { d[i].featured = { ...(d[i].featured ?? emptyFeatured), href: e.target.value }; })} />
                <ImageUploader folder="nav" value={item.featured?.image ?? ""} onChange={(v) => set((d) => { d[i].featured = { ...(d[i].featured ?? emptyFeatured), image: v }; })} />
              </div>
              <button onClick={() => set((d) => { delete d[i].mega; delete d[i].featured; })} className="text-[12px] text-accent hover:underline">
                Quitar mega-menú
              </button>
            </div>
          ) : (
            <button onClick={() => set((d) => { d[i].mega = [{ heading: "Columna", links: [{ label: "Nuevo", href: "#" }] }]; })} className="text-[12px] text-ash hover:text-ink">
              + agregar mega-menú
            </button>
          )}
        </div>
      ))}
      <Btn variant="outline" onClick={() => onChange([...nav, { label: "Nuevo", href: "/" }])}>
        <Plus size={14} /> Agregar ítem
      </Btn>
    </div>
  );
}
