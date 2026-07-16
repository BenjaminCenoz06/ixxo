"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Package, Clock, CheckCircle2, Truck, Ban } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  number: string;
  email: string;
  name: string;
  phone: string;
  securityCode: string;
  status: string;
  total: number;
  items: number;
  lineItems: { name: string; code: string; qty: number; price: number }[];
  createdAt: string;
  paymentMethod: string;
  shippingType: string;
  shippingCompany: string;
  needsInvoice: boolean;
  invoiceName: string;
  invoiceCuit: string;
  address: string;
}

const STATUSES = ["pending", "paid", "preparing", "shipped", "delivered", "cancelled"];
const LABEL: Record<string, string> = {
  pending: "Compra pendiente de verificación",
  paid: "Pago confirmado",
  preparing: "Preparando pedido",
  shipped: "Pedido enviado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
};
const SHORT: Record<string, string> = {
  pending: "Pendientes",
  paid: "Confirmados",
  preparing: "Preparando",
  shipped: "Enviados",
  delivered: "Entregados",
  cancelled: "Cancelados",
};
const BADGE_LABEL: Record<string, string> = {
  pending: "Pend. de verificación",
  paid: "Pago confirmado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};
const STATUS_STYLE: Record<string, { badge: string; Icon: typeof Clock }> = {
  pending: { badge: "border-amber-300 bg-amber-50 text-amber-700", Icon: Clock },
  paid: { badge: "border-green-300 bg-green-50 text-green-700", Icon: CheckCircle2 },
  preparing: { badge: "border-blue-300 bg-blue-50 text-blue-700", Icon: Package },
  shipped: { badge: "border-blue-300 bg-blue-50 text-blue-700", Icon: Truck },
  delivered: { badge: "border-green-300 bg-green-50 text-green-700", Icon: CheckCircle2 },
  cancelled: { badge: "border-red-300 bg-red-50 text-red-700", Icon: Ban },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  const Icon = s.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium", s.badge)}>
      <Icon size={12} strokeWidth={2} />
      {BADGE_LABEL[status] ?? status}
    </span>
  );
}
const PAY_LABEL: Record<string, string> = {
  transfer: "Transferencia",
  mercadopago: "Mercado Pago",
  card: "Tarjeta",
};
const SHIP_LABEL: Record<string, string> = {
  retiro: "Retiro en local",
  correo: "Correo",
  transporte: "Transporte",
};
const FILTERS = ["Todos", ...STATUSES];

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("Todos");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(d.error))))
      .then((d) => setOrders(d.orders ?? []))
      .catch((e) => setError(typeof e === "string" ? e : "No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (o: Order, status: string) => {
    setOrders((prev) => prev.map((x) => (x.number === o.number ? { ...x, status } : x)));
    setSavingId(o.number);
    try {
      await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: o.number, status }),
      });
    } finally {
      setSavingId(null);
    }
  };

  const visible = useMemo(
    () => (filter === "Todos" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  return (
    <>
      <PageHeader title="Pedidos" subtitle={`${orders.length} pedidos`} />

      {!loading && !error && orders.length > 0 && (
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
              {f === "Todos" ? "Todos" : SHORT[f] || f}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 border border-line bg-paper py-16 text-ash">
          <Loader2 size={18} className="animate-spin" /> Cargando pedidos…
        </div>
      ) : error ? (
        <div className="border border-line bg-paper p-6 text-[13px] text-accent">{error}</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-line bg-paper py-16 text-center text-ash">
          <Package size={32} strokeWidth={1} />
          <p className="text-[13px]">Todavía no hay pedidos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[980px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Productos</th>
                <th className="px-4 py-3 font-medium">Entrega / Pago</th>
                <th className="px-4 py-3 font-medium">Fecha y hora</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((o) => (
                <tr key={o.id} className="align-top hover:bg-smoke/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.number}</p>
                    {o.securityCode && (
                      <p className="mt-0.5 font-mono text-[11px] tracking-wider text-ink-soft">
                        Cód: {o.securityCode}
                      </p>
                    )}
                    <p className="text-[11px] text-stone">{o.items} art.</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{o.name}</p>
                    <p className="text-[11px] text-stone">{o.email}</p>
                    {o.phone && <p className="text-[11px] text-stone">{o.phone}</p>}
                    {o.needsInvoice && (
                      <p className="mt-1 text-[11px] text-ink-soft">
                        Factura: {o.invoiceName} · CUIT {o.invoiceCuit}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px]">
                    {o.lineItems.length === 0 ? (
                      <span className="text-stone">—</span>
                    ) : (
                      <ul className="space-y-1.5">
                        {o.lineItems.map((li, i) => (
                          <li key={i}>
                            <span className="font-medium">{li.name}</span>
                            <span className="block text-[11px] text-stone">Cód: {li.code} · Cant: {li.qty}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ash">
                    <p>{SHIP_LABEL[o.shippingType] || o.shippingType || "—"}</p>
                    {o.shippingType === "transporte" && o.shippingCompany && (
                      <p className="text-[11px] text-stone">{o.shippingCompany}</p>
                    )}
                    {o.address && <p className="text-[11px] text-stone">{o.address}</p>}
                    <p className="mt-1 text-[11px] text-ink-soft">
                      {PAY_LABEL[o.paymentMethod] || o.paymentMethod || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-ash">
                    {o.createdAt ? (
                      <>
                        <p>{new Date(o.createdAt).toLocaleDateString("es-AR")}</p>
                        <p className="text-[11px] text-stone">
                          {new Date(o.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}
                        </p>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <StatusBadge status={o.status} />
                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => setStatus(o, e.target.value)}
                          className="border border-line bg-paper px-2 py-1 text-[12px] outline-none focus:border-ink"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {LABEL[s]}
                            </option>
                          ))}
                        </select>
                        {savingId === o.number && <Loader2 size={13} className="animate-spin text-ash" />}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ash">
                    No hay pedidos con este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
