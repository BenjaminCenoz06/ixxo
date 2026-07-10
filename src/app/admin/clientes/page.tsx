"use client";

import { PageHeader } from "@/components/admin/ui";
import { demoCustomers } from "@/data/admin-demo";
import { formatPrice } from "@/lib/format";

export default function AdminClientes() {
  return (
    <>
      <PageHeader title="Clientes" subtitle={`${demoCustomers.length} clientes registrados`} />
      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Pedidos</th>
              <th className="px-4 py-3 font-medium">Gastado</th>
              <th className="px-4 py-3 font-medium">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {demoCustomers.map((c) => (
              <tr key={c.email} className="hover:bg-smoke/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-paper">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash">{c.email}</td>
                <td className="px-4 py-3">{c.orders}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(c.spent)}</td>
                <td className="px-4 py-3 text-ash">
                  {new Date(c.since).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
