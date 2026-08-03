"use client";

import { useEffect, useState } from "react";

/** Pedido tal como lo devuelve /api/admin/orders. */
export interface AdminOrder {
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

/** Estados que cuentan como venta concretada para las métricas. */
export const VENDIDOS = ["paid", "preparing", "shipped", "delivered"];

/**
 * Pedidos reales del local. El dashboard usaba `demoOrders` del archivo de
 * datos de ejemplo aunque hubiera base conectada, así que mostraba ventas y
 * clientes inventados: números en los que el dueño no puede confiar.
 */
export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(d.error))))
      .then((d) => vivo && setOrders(d.orders ?? []))
      .catch((e) => vivo && setError(typeof e === "string" ? e : "No se pudieron cargar los pedidos"))
      .finally(() => vivo && setLoading(false));
    return () => {
      vivo = false;
    };
  }, []);

  return { orders, loading, error };
}

/** Métricas del dashboard calculadas sobre pedidos reales. */
export function metricas(orders: AdminOrder[], dias = 7) {
  const desde = Date.now() - dias * 24 * 60 * 60 * 1000;
  const vendidos = orders.filter((o) => VENDIDOS.includes(o.status));
  const recientes = vendidos.filter((o) => new Date(o.createdAt).getTime() >= desde);

  const suma = (xs: AdminOrder[]) => xs.reduce((s, o) => s + o.total, 0);
  const facturado = suma(recientes);

  return {
    facturado,
    pedidosPeriodo: recientes.length,
    pedidosTotales: orders.length,
    pendientes: orders.filter((o) => o.status === "pending").length,
    // Sin ventas no hay promedio: dividir por cero mostraba NaN.
    ticketPromedio: recientes.length ? Math.round(facturado / recientes.length) : 0,
  };
}
