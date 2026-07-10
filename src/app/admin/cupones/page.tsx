"use client";

import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import { PageHeader, Btn } from "@/components/admin/ui";
import { listCoupons } from "@/lib/checkout";
import { cn } from "@/lib/utils";

export default function AdminCupones() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(listCoupons().map((c) => [c.code, true])),
  );
  const coupons = listCoupons();

  return (
    <>
      <PageHeader
        title="Cupones"
        subtitle={`${coupons.length} cupones`}
        action={
          <Btn variant="outline">
            <Plus size={15} /> Nuevo cupón
          </Btn>
        }
      />
      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[560px] text-[13px]">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-smoke/50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Ticket size={14} className="text-ash" /> {c.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-ash">{c.label}</td>
                <td className="px-4 py-3 text-ash">
                  {c.type === "percent" ? "Porcentaje" : "Envío"}
                </td>
                <td className="px-4 py-3">{c.type === "percent" ? `${c.value}%` : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setActive((a) => ({ ...a, [c.code]: !a[c.code] }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      active[c.code] ? "bg-ink" : "bg-mist",
                    )}
                    aria-pressed={active[c.code]}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform",
                        active[c.code] ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
