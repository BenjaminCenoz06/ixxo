"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader, Card, Btn } from "@/components/admin/ui";

const inputCls =
  "w-full border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink";

export default function AdminConfiguracion() {
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Configuración"
        subtitle="Ajustes generales de la tienda"
        action={
          <Btn onClick={save}>
            {saved ? (
              <>
                <Check size={15} /> Guardado
              </>
            ) : (
              "Guardar cambios"
            )}
          </Btn>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Datos de la tienda">
          <div className="space-y-4">
            <Field label="Nombre">
              <input defaultValue="Custom Wear" className={inputCls} />
            </Field>
            <Field label="Email de contacto">
              <input defaultValue="customwear.cba@gmail.com" className={inputCls} />
            </Field>
            <Field label="Teléfono / WhatsApp">
              <input defaultValue="+54 9 351 808 6096" className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="Envíos">
          <div className="space-y-4">
            <Field label="Umbral de envío gratis (ARS)">
              <input type="number" defaultValue={90000} className={inputCls} />
            </Field>
            <Field label="Costo de envío base (ARS)">
              <input type="number" defaultValue={6900} className={inputCls} />
            </Field>
            <Field label="Descuento por transferencia (%)">
              <input type="number" defaultValue={15} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="Redes sociales">
          <div className="space-y-4">
            <Field label="Instagram">
              <input defaultValue="@customwear.cba" className={inputCls} />
            </Field>
            <Field label="TikTok">
              <input defaultValue="@customwear.cba" className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="Medios de pago">
          <div className="space-y-3">
            {["Mercado Pago", "Transferencia", "Tarjeta de crédito/débito"].map((m) => (
              <label key={m} className="flex items-center justify-between text-[14px]">
                {m}
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-ink" />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
