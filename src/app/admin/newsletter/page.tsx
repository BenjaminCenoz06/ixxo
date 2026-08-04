"use client";

import { useEffect, useState } from "react";
import { Download, Mail, Loader2, Inbox } from "lucide-react";
import { PageHeader, Btn, StatCard } from "@/components/admin/ui";

interface Suscriptor {
  email: string;
  date: string;
}

/**
 * Suscriptores del newsletter.
 *
 * Antes mostraba `demoNewsletter`, una lista de ejemplo, y hasta una "tasa de
 * apertura" del 42% que no salía de ningún lado: no existe envío de campañas.
 * Ahora lee las altas reales que deja el formulario de la tienda.
 */
export default function AdminNewsletter() {
  const [subs, setSubs] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => (r.ok ? r.json() : r.json().then((d) => Promise.reject(d.error))))
      .then((d) => setSubs(d.subscribers ?? []))
      .catch((e) => setError(typeof e === "string" ? e : "No se pudieron cargar los suscriptores"))
      .finally(() => setLoading(false));
  }, []);

  const semana = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recientes = subs.filter((s) => new Date(s.date).getTime() >= semana).length;

  const exportCsv = () => {
    const csv = ["email,fecha", ...subs.map((s) => `${s.email},${s.date}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-goodstyle.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Newsletter"
        subtitle={loading ? "Cargando…" : `${subs.length} suscriptores`}
        action={
          <Btn variant="outline" onClick={exportCsv} disabled={loading || subs.length === 0}>
            <Download size={15} /> Exportar CSV
          </Btn>
        }
      />

      {error && (
        <div className="mb-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard label="Suscriptores" value={loading ? "—" : String(subs.length)} />
        <StatCard label="Últimos 7 días" value={loading ? "—" : String(recientes)} />
      </div>

      <div className="border border-line bg-paper">
        {loading ? (
          <p className="flex items-center gap-2 px-5 py-8 text-[13px] text-ash">
            <Loader2 size={15} className="animate-spin" /> Cargando…
          </p>
        ) : subs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Inbox size={30} strokeWidth={1.2} className="mx-auto text-stone" />
            <p className="mt-3 text-[13px] font-medium">Todavía no hay suscriptores</p>
            <p className="mt-1 text-[12px] text-ash">
              Aparecen acá cuando alguien deja su correo en el pie de la tienda.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {subs.map((s) => (
              <li
                key={s.email}
                className="flex items-center justify-between gap-4 px-5 py-3.5 text-[14px]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Mail size={15} className="shrink-0 text-ash" />
                  <span className="truncate">{s.email}</span>
                </span>
                <span className="shrink-0 text-[12px] text-ash">
                  {new Date(s.date).toLocaleDateString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
