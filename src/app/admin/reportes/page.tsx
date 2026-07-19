"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Download, FileText, Trash2, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";

interface LineItem {
  name: string;
  code: string;
  qty: number;
  price: number;
}
interface Order {
  number: string;
  email: string;
  name: string;
  phone: string;
  securityCode: string;
  status: string;
  total: number;
  lineItems: LineItem[];
  createdAt: string;
  paymentMethod: string;
}

const CONFIRMED = new Set(["paid", "preparing", "shipped", "delivered"]);
const STATUS_LABEL: Record<string, string> = {
  pending: "Compra pendiente de verificación",
  paid: "Pago confirmado",
  preparing: "Preparando pedido",
  shipped: "Pedido enviado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
};
const PAY_LABEL: Record<string, string> = {
  transfer: "Transferencia",
  mercadopago: "Mercado Pago",
  card: "Tarjeta",
};

const monthKey = (iso: string) => (iso || "").slice(0, 7); // YYYY-MM
const monthName = (key: string) => {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  const label = d.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const fdate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("es-AR") : "");
const ftime = (iso: string) =>
  iso ? new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "";
const productsText = (o: Order) =>
  o.lineItems.map((li) => `${li.name} (${li.code}) x${li.qty}`).join(" | ");

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCSV(orders: Order[]) {
  const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Fecha", "Hora", "Pedido", "Codigo seguridad", "Estado", "Cliente", "Email", "Telefono", "Metodo de pago", "Productos", "Total"];
  const rows = orders.map((o) => [
    fdate(o.createdAt),
    ftime(o.createdAt),
    o.number,
    o.securityCode,
    STATUS_LABEL[o.status] ?? o.status,
    o.name,
    o.email,
    o.phone,
    PAY_LABEL[o.paymentMethod] || o.paymentMethod,
    productsText(o),
    o.total,
  ]);
  return "﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

function printPDF(key: string, orders: Order[], confirmedCount: number, revenue: number) {
  const rows = orders
    .map(
      (o) => `<tr>
        <td>${fdate(o.createdAt)} ${ftime(o.createdAt)}</td>
        <td>${o.number}<br><small>${o.securityCode}</small></td>
        <td>${o.name}<br><small>${o.email}</small></td>
        <td>${o.lineItems.map((li) => `${li.name} (${li.code}) x${li.qty}`).join("<br>")}</td>
        <td>${PAY_LABEL[o.paymentMethod] || o.paymentMethod}</td>
        <td>${STATUS_LABEL[o.status] ?? o.status}</td>
        <td style="text-align:right">${formatPrice(o.total)}</td>
      </tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Reporte ${monthName(key)}</title>
    <style>
      body{font-family:Helvetica,Arial,sans-serif;color:#111;padding:32px}
      h1{font-size:20px;margin:0 0 4px} .sub{color:#666;font-size:13px;margin:0 0 20px}
      .kpis{display:flex;gap:16px;margin:0 0 20px}
      .kpi{border:1px solid #eee;padding:12px 16px;border-radius:8px}
      .kpi b{display:block;font-size:22px} .kpi span{font-size:12px;color:#666}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border-bottom:1px solid #eee;padding:8px;text-align:left;vertical-align:top}
      th{background:#fafafa;text-transform:uppercase;font-size:10px;color:#666}
      small{color:#888}
    </style></head><body>
      <h1>Custom Wear — Reporte de ${monthName(key)}</h1>
      <p class="sub">Generado el ${new Date().toLocaleString("es-AR")}</p>
      <div class="kpis">
        <div class="kpi"><b>${confirmedCount}</b><span>Pedidos confirmados</span></div>
        <div class="kpi"><b>${formatPrice(revenue)}</b><span>Facturado (confirmado)</span></div>
        <div class="kpi"><b>${orders.length}</b><span>Pedidos totales del mes</span></div>
      </div>
      <table><thead><tr>
        <th>Fecha</th><th>Pedido / Cód.</th><th>Cliente</th><th>Productos</th><th>Pago</th><th>Estado</th><th style="text-align:right">Total</th>
      </tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

export default function AdminReportes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(d.error))))
      .then((d) => setOrders(d.orders ?? []))
      .catch((e) => setError(typeof e === "string" ? e : "No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  }, []);

  const months = useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const o of orders) {
      const k = monthKey(o.createdAt);
      if (!k) continue;
      (map.get(k) ?? map.set(k, []).get(k)!).push(o);
    }
    return [...map.entries()]
      .map(([key, list]) => {
        const confirmed = list.filter((o) => CONFIRMED.has(o.status));
        return {
          key,
          list,
          confirmedCount: confirmed.length,
          revenue: confirmed.reduce((s, o) => s + (o.total || 0), 0),
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [orders]);

  const currentKey = new Date().toISOString().slice(0, 7);
  const current = months.find((m) => m.key === currentKey);

  const closeMonth = async (key: string, list: Order[]) => {
    if (
      !confirm(
        `Vas a BORRAR los ${list.length} pedidos de ${monthName(key)}. ` +
          `Descargá primero el reporte (CSV o PDF). Esta acción no se puede deshacer. ¿Continuar?`,
      )
    )
      return;
    setBusy(key);
    try {
      await fetch("/api/admin/orders/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: list.map((o) => o.number) }),
      });
      setOrders((prev) => prev.filter((o) => monthKey(o.createdAt) !== key));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader title="Reportes" subtitle="Ventas por mes, descarga y cierre mensual" />

      {/* Resumen del mes actual */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-line bg-paper p-5">
          <div className="flex items-center gap-2 text-ash">
            <TrendingUp size={16} />
            <span className="text-[12px] uppercase tracking-wide">Este mes</span>
          </div>
          <p className="mt-3 font-display text-3xl">{current?.confirmedCount ?? 0}</p>
          <p className="text-[12px] text-ash">pedidos confirmados</p>
        </div>
        <div className="border border-line bg-paper p-5">
          <span className="text-[12px] uppercase tracking-wide text-ash">Facturado este mes</span>
          <p className="mt-3 font-display text-3xl">{formatPrice(current?.revenue ?? 0)}</p>
          <p className="text-[12px] text-ash">solo pedidos confirmados</p>
        </div>
        <div className="border border-line bg-paper p-5">
          <span className="text-[12px] uppercase tracking-wide text-ash">Pedidos totales</span>
          <p className="mt-3 font-display text-3xl">{current?.list.length ?? 0}</p>
          <p className="text-[12px] text-ash">{monthName(currentKey)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 border border-line bg-paper py-16 text-ash">
          <Loader2 size={18} className="animate-spin" /> Cargando…
        </div>
      ) : error ? (
        <div className="border border-line bg-paper p-6 text-[13px] text-accent">{error}</div>
      ) : months.length === 0 ? (
        <div className="border border-line bg-paper py-16 text-center text-[13px] text-ash">
          Todavía no hay pedidos para reportar.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[12px] text-ash">
            Descargá el reporte de cada mes (CSV para Excel o PDF para imprimir) y después usá
            “Cerrar mes” para borrar esos pedidos y no acumular. El archivo te queda como respaldo.
          </p>
          {months.map((m) => (
            <div
              key={m.key}
              className="flex flex-col gap-4 border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display text-lg">{monthName(m.key)}</p>
                <p className="text-[12px] text-ash">
                  {m.confirmedCount} confirmados · {formatPrice(m.revenue)} · {m.list.length} pedidos totales
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => download(`reporte-${m.key}.csv`, toCSV(m.list), "text/csv;charset=utf-8")}
                  className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[12px] transition-colors hover:border-ink"
                >
                  <Download size={14} /> CSV
                </button>
                <button
                  onClick={() => printPDF(m.key, m.list, m.confirmedCount, m.revenue)}
                  className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[12px] transition-colors hover:border-ink"
                >
                  <FileText size={14} /> PDF
                </button>
                <button
                  onClick={() => closeMonth(m.key, m.list)}
                  disabled={busy === m.key}
                  className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[12px] text-accent transition-colors hover:border-accent disabled:opacity-50"
                >
                  {busy === m.key ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Cerrar mes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
