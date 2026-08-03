"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, AlertTriangle, Loader2, Inbox, Clock } from "lucide-react";
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/admin/ui";
import { useAdminProducts } from "@/lib/admin-data";
import { useAdminOrders, metricas } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const { items } = useAdminProducts();
  // Pedidos REALES. Antes esto salía de demoOrders aunque hubiera base
  // conectada, así que las ventas y los clientes eran inventados.
  const { orders, loading, error } = useAdminOrders();

  const m = metricas(orders);
  const lowStock = items.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = items.filter((p) => p.stock === 0);
  const inventoryValue = items.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen de tu tienda" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ventas (7 días)"
          value={loading ? "—" : formatPrice(m.facturado)}
          hint={loading ? "cargando…" : `${m.pedidosPeriodo} ${m.pedidosPeriodo === 1 ? "pedido" : "pedidos"}`}
        />
        <StatCard label="Productos" value={String(items.length)} hint={`${outOfStock.length} sin stock`} />
        <StatCard label="Valor inventario" value={formatPrice(inventoryValue)} />
        <StatCard
          label="Ticket promedio"
          value={loading || !m.ticketPromedio ? "—" : formatPrice(m.ticketPromedio)}
          hint={m.pendientes > 0 ? `${m.pendientes} por verificar` : undefined}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Pedidos recientes */}
        <Card title="Pedidos recientes">
          {loading ? (
            <p className="flex items-center gap-2 py-6 text-[13px] text-ash">
              <Loader2 size={15} className="animate-spin" /> Cargando pedidos…
            </p>
          ) : error ? (
            <p className="py-6 text-[13px] text-accent">{error}</p>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <Inbox size={30} strokeWidth={1.2} className="mx-auto text-stone" />
              <p className="mt-3 text-[13px] font-medium">Todavía no hay pedidos</p>
              <p className="mt-1 text-[12px] text-ash">
                Cuando alguien compre en la tienda, va a aparecer acá.
              </p>
            </div>
          ) : (
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
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.number}>
                      <td className="py-3 font-medium">{o.number}</td>
                      <td className="py-3 text-ash">{o.name}</td>
                      <td className="py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-3 text-right">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      {/* Pendientes de verificación: lo primero que el dueño tiene que mirar,
          porque son pagos por transferencia que alguien declaró y nadie chequeó. */}
      {!loading && m.pendientes > 0 && (
        <div className="mt-6 flex items-center gap-3 border border-amber-300 bg-amber-50 px-5 py-4 text-[13px] text-amber-800">
          <Clock size={17} strokeWidth={1.6} className="shrink-0" />
          <span>
            Tenés <strong>{m.pendientes}</strong>{" "}
            {m.pendientes === 1 ? "pedido pendiente" : "pedidos pendientes"} de verificación.
          </span>
          <Link href="/admin/pedidos" className="ml-auto shrink-0 font-medium underline underline-offset-4">
            Revisar
          </Link>
        </div>
      )}
    </>
  );
}
