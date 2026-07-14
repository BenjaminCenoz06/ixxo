"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";

interface Customer {
  id: string;
  email: string;
  name: string;
  provider: string;
  createdAt: string;
  lastSignIn: string | null;
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

export default function AdminClientes() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(d.error))))
      .then((d) => setCustomers(d.customers ?? []))
      .catch((e) => setError(typeof e === "string" ? e : "No se pudieron cargar los clientes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) => c.email.toLowerCase().includes(term) || c.name.toLowerCase().includes(term),
    );
  }, [customers, q]);

  return (
    <>
      <PageHeader title="Clientes" subtitle={`${customers.length} cuentas registradas`} />

      {!loading && !error && customers.length > 0 && (
        <div className="mb-4 flex items-center gap-2 border border-line bg-paper px-3 py-2">
          <Search size={16} className="text-ash" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 border border-line bg-paper py-16 text-ash">
          <Loader2 size={18} className="animate-spin" /> Cargando clientes…
        </div>
      ) : error ? (
        <div className="border border-line bg-paper p-6 text-[13px] text-accent">{error}</div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-line bg-paper py-16 text-center text-ash">
          <Users size={32} strokeWidth={1} />
          <p className="text-[13px]">Todavía no hay clientes registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ash">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Método</th>
                <th className="px-4 py-3 font-medium">Registrado</th>
                <th className="px-4 py-3 font-medium">Último ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-smoke/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-paper">
                        {(c.name || c.email).split(/[\s.]+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-medium">{c.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ash">{c.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.provider === "google"
                          ? "rounded-full border border-line px-2.5 py-1 text-[11px] font-medium"
                          : "rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ash"
                      }
                    >
                      {c.provider === "google" ? "Google" : "Email"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ash">{fmtDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-ash">{fmtDate(c.lastSignIn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
