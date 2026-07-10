"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/admin/ui";
import { useAdminProducts } from "@/lib/admin-data";
import { demoOrders } from "@/data/admin-demo";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const { items } = useAdminProducts();

  const revenue = demoOrders
    .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);
  const lowStock = items.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = items.filter((p) => p.stock === 0);
  const inventoryValue = items.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen de tu tienda" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ventas (7 días)" value={formatPrice(revenue)} hint={`${demoOrders.length} pedidos`} />
        <StatCard label="Productos" value={String(items.length)} hint={`${outOfStock.length} sin stock`} />
        <StatCard label="Valor inventario" value={formatPrice(inventoryValue)} />
        <StatCard label="Ticket promedio" value={formatPrice(Math.round(revenue / demoOrders.length))} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Pedidos recientes */}
        <Card title="Pedidos recientes">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
                  <th className="pb-3 font-medium">Pedido</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {demoOrders.slice(0, 6).map((o) => (
                  <tr key={o.number}>
                    <td className="py-3 font-medium">{o.number}</td>
                    <td className="py-3 text-ash">{o.customer}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-right">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-wide"
          >
            Ver todos <ArrowUpRight size={14} />
          </Link>
        </Card>

        {/* Alertas de stock */}
        <Card title="Alertas de stock">
          {lowStock.length === 0 ? (
            <p className="flex items-center gap-2 text-[13px] text-ash">
              <TrendingUp size={15} /> Todo el stock está en niveles saludables.
            </p>
          ) : (
            <ul className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 truncate">
                    <AlertTriangle size={14} className="shrink-0 text-accent" />
                    <span className="truncate">{p.name}</span>
                  </span>
                  <span className="shrink-0 font-medium text-accent">{p.stock} u.</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/productos"
            className="mt-5 inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-wide"
          >
            Gestionar productos <ArrowUpRight size={14} />
          </Link>
        </Card>
      </div>
    </>
  );
}
