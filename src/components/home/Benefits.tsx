"use client";

import { MapPin, ShieldCheck, Truck } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { formatPrice } from "@/lib/format";

/**
 * Franja de beneficios: envío, seguridad y retiro en el local.
 * Los textos se arman con los datos del negocio cargados en /admin.
 */
export default function Benefits() {
  const { general } = useSiteContent();

  const items = [
    {
      icon: Truck,
      title: "Envíos rápidos",
      detail: general.freeShippingThreshold
        ? `gratis desde ${formatPrice(general.freeShippingThreshold)}`
        : "a todo el país",
    },
    {
      icon: ShieldCheck,
      title: "Compra segura",
      detail: "protección garantizada",
    },
    {
      icon: MapPin,
      title: "Retiro en el local",
      detail: general.address || "sin cargo",
    },
  ];

  return (
    <section className="container-ixxo pb-4 pt-14 md:pt-20">
      <ul className="grid divide-y divide-line border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-center gap-3 px-5 py-5">
            <Icon size={22} strokeWidth={1.4} className="shrink-0 text-ash" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">{title}</p>
              <p className="truncate text-[12px] text-ash">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
