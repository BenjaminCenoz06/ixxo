"use client";

import { useState } from "react";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { demoOrders, type DemoOrder } from "@/data/admin-demo";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"];
const FILTERS = ["Todos", ...STATUSES];

export default function AdminPedidos() {
  const [orders, setOrders] = useState<DemoOrder[]>(demoOrders);
  const [filter, setFilter] = useState("Todos");

  const setStatus = async (number: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.number === number ? { ...o, status } : o)));
    const sb = getSupabaseBrowser();
    if (sb) await sb.from("orders").update({ status }).eq("number", number);
  };

  const visible = filter === "Todos" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <PageHeader title="Pedidos" subtitle={`${orders.length} pedidos`} />

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3.5 py-1.5 text-[12px] transition-colors",
              filter === f ? "bg-ink text-paper" : "border border-line text-ink-soft hover:border-ink",
            )}
          >
            {f === "Todos" ? "Todos" : <StatusBadgeLabel status={f} />}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((o) => (
              <tr key={o.number} className="hover:bg-smoke/50">
                <td className="px-4 py-3 font-medium">{o.number}</td>
                <td className="px-4 py-3">
                  <p>{o.customer}</p>
                  <p className="text-[11px] text-stone">{o.email}</p>
                </td>
                <td className="px-4 py-3 text-ash">
                  {new Date(o.date).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3 text-ash">{o.items}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.number, e.target.value)}
                    className="border border-line bg-paper px-2 py-1 text-[12px] outline-none focus:border-ink"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ash">
                  No hay pedidos con este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function statusLabel(s: string) {
  return (
    {
      pending: "Pendiente",
      paid: "Pagado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
    }[s] ?? s
  );
}

function StatusBadgeLabel({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}
