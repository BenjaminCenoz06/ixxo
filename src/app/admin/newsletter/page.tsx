"use client";

import { Download, Mail } from "lucide-react";
import { PageHeader, Btn, StatCard } from "@/components/admin/ui";
import { demoNewsletter } from "@/data/admin-demo";

export default function AdminNewsletter() {
  const exportCsv = () => {
    const csv = ["email,fecha", ...demoNewsletter.map((s) => `${s.email},${s.date}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-ixxo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Newsletter"
        subtitle="Suscriptores"
        action={
          <Btn variant="outline" onClick={exportCsv}>
            <Download size={15} /> Exportar CSV
          </Btn>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Suscriptores" value={String(demoNewsletter.length)} />
        <StatCard label="Últimos 7 días" value={String(demoNewsletter.length)} />
        <StatCard label="Tasa de apertura" value="42%" hint="promedio" />
      </div>
      <div className="border border-line bg-paper">
        <ul className="divide-y divide-line">
          {demoNewsletter.map((s) => (
            <li key={s.email} className="flex items-center justify-between px-5 py-3.5 text-[14px]">
              <span className="flex items-center gap-3">
                <Mail size={15} className="text-ash" /> {s.email}
              </span>
              <span className="text-[12px] text-ash">
                {new Date(s.date).toLocaleDateString("es-AR")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
