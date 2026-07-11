"use client";

import { Plus, Ticket, Trash2, Loader2, Check } from "lucide-react";
import { useAdminContent } from "@/lib/admin-content";
import { PageHeader, Btn } from "@/components/admin/ui";

const inputCls =
  "w-full border border-line px-3 py-2 text-[13px] outline-none transition-colors focus:border-ink";

export default function AdminCupones() {
  const { content, patch, loading, saving, saved, save } = useAdminContent();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-ash" />
      </div>
    );
  }

  const coupons = content.coupons;
  const update = (i: number, field: string, value: string | number) => {
    const next = coupons.map((c, idx) => (idx === i ? { ...c, [field]: value } : c));
    patch("coupons", next as typeof coupons);
  };

  return (
    <>
      <PageHeader
        title="Cupones"
        subtitle={`${coupons.length} cupones · descuentos que tus clientes aplican en el carrito`}
        action={
          <Btn onClick={save}>
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Guardando…
              </>
            ) : saved ? (
              <>
                <Check size={15} /> Guardado
              </>
            ) : (
              "Guardar cambios"
            )}
          </Btn>
        }
      />

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Valor (%)</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coupons.map((c, i) => (
              <tr key={i}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <Ticket size={14} className="shrink-0 text-ash" />
                    <input value={c.code} onChange={(e) => update(i, "code", e.target.value.toUpperCase())} className={inputCls} />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input value={c.label} onChange={(e) => update(i, "label", e.target.value)} className={inputCls} />
                </td>
                <td className="px-4 py-2">
                  <select value={c.type} onChange={(e) => update(i, "type", e.target.value)} className={`${inputCls} bg-paper`}>
                    <option value="percent">Porcentaje</option>
                    <option value="fixed">Envío gratis</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input type="number" value={c.value} disabled={c.type === "fixed"} onChange={(e) => update(i, "value", +e.target.value)} className={`${inputCls} disabled:opacity-40`} />
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => patch("coupons", coupons.filter((_, j) => j !== i))} className="p-1.5 text-stone hover:text-accent" aria-label="Eliminar">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ash">
                  No hay cupones. Agregá uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Btn variant="outline" onClick={() => patch("coupons", [...coupons, { code: "NUEVO", label: "Descripción", type: "percent", value: 10 }])}>
          <Plus size={14} /> Agregar cupón
        </Btn>
      </div>

      <p className="mt-4 text-[12px] text-ash">
        Tipo <strong className="text-ink">Porcentaje</strong>: descuenta ese % del subtotal.{" "}
        <strong className="text-ink">Envío gratis</strong>: quita el costo de envío. Acordate de{" "}
        <strong className="text-ink">Guardar</strong>.
      </p>
    </>
  );
}
