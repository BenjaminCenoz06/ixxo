"use client";

import { Check, Loader2 } from "lucide-react";
import { PageHeader, Card, Btn } from "@/components/admin/ui";
import { useAdminContent } from "@/lib/admin-content";

const inputCls =
  "w-full border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink";

/**
 * Ajustes generales.
 *
 * Antes esta pantalla era decorativa: los campos tenían valores fijos escritos
 * en el código (mostraba $90.000 de envío gratis y 15% de transferencia, los
 * dos incorrectos) y el botón Guardar solo encendía un cartel dos segundos sin
 * escribir nada. El dueño editaba, leía "Guardado" y no pasaba nada.
 *
 * Ahora lee y escribe el mismo contenido que /admin/contenido, así que los dos
 * lados muestran siempre lo mismo.
 */
export default function AdminConfiguracion() {
  const { content, loading, saving, saved, error, patch, save } = useAdminContent();
  const { general, shipping, payments } = content;

  const setGeneral = (v: Partial<typeof general>) => patch("general", { ...general, ...v });

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-20 text-[14px] text-ash">
        <Loader2 size={16} className="animate-spin" /> Cargando ajustes…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Configuración"
        subtitle="Ajustes generales de la tienda"
        action={
          <Btn onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Guardando…
              </>
            ) : saved ? (
              <>
                <Check size={15} /> Guardado
              </>
            ) : (
              "Guardar cambios"
            )}
          </Btn>
        }
      />

      {error && (
        <div className="mb-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Datos de la tienda">
          <div className="space-y-4">
            <Field label="Nombre">
              <input
                value={general.storeName}
                onChange={(e) => setGeneral({ storeName: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Email de contacto">
              <input
                value={general.email}
                onChange={(e) => setGeneral({ email: e.target.value })}
                placeholder="Sin email cargado"
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp (con código de país, sin +)">
              <input
                value={general.whatsapp}
                onChange={(e) => setGeneral({ whatsapp: e.target.value })}
                placeholder="5493786411223"
                className={inputCls}
              />
            </Field>
            <Field label="Dirección del local">
              <input
                value={general.address}
                onChange={(e) => setGeneral({ address: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        <Card title="Envíos">
          <div className="space-y-4">
            <Field label="Envío gratis a partir de (ARS)">
              <input
                type="number"
                value={general.freeShippingThreshold}
                onChange={(e) => setGeneral({ freeShippingThreshold: +e.target.value })}
                className={inputCls}
              />
            </Field>
            <p className="text-[12px] leading-relaxed text-ash">
              Este número lo usa el carrito para no cobrar el envío, y también aparece en la ficha
              de producto, en Envíos y en los Términos.
            </p>
            <Field label="Descuento por transferencia (%)">
              <input
                type="number"
                value={general.transferDiscount}
                onChange={(e) => setGeneral({ transferDiscount: +e.target.value })}
                className={inputCls}
              />
            </Field>
            <p className="text-[12px] leading-relaxed text-ash">
              En 0 no se muestra ninguna promesa de descuento en la tienda.
            </p>
          </div>
        </Card>

        <Card title="Costo de envío por zona (ARS)">
          <div className="space-y-4">
            {(
              [
                ["metro", "AMBA"],
                ["centro", "Centro"],
                ["interior", "Interior"],
                ["patagonia", "Patagonia"],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={label}>
                <input
                  type="number"
                  value={shipping[k]}
                  onChange={(e) => patch("shipping", { ...shipping, [k]: +e.target.value })}
                  className={inputCls}
                />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Medios de pago">
          <div className="space-y-3">
            <p className="text-[12px] leading-relaxed text-ash">
              Se muestran en el pie de la tienda. Uno por línea.
            </p>
            <textarea
              rows={5}
              value={payments.join("\n")}
              onChange={(e) =>
                patch(
                  "payments",
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                )
              }
              className={inputCls}
            />
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
