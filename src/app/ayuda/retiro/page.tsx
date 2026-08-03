import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, MessageCircle, ShoppingBag } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ProductStrip from "@/components/product/ProductStrip";
import { Article } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/repository/content";

export const metadata: Metadata = {
  title: "Retiro en el local",
  description:
    "Retirá tu pedido sin cargo en el local de GoodStyle en Ituzaingó, Corrientes. Dirección, horarios y cómo llegar.",
};

export const dynamic = "force-dynamic";

export default async function RetiroPage() {
  const { general } = await getSiteContent();

  const datos = [
    { icon: MapPin, label: "Dirección", value: general.address, href: general.mapUrl },
    { icon: Clock, label: "Horario", value: general.hours },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+54 9 3786 41-1223",
      href: `https://wa.me/${general.whatsapp}`,
    },
  ].filter((d) => d.value);

  return (
    <>
      <PageHero
        eyebrow="Ayuda"
        title="Retiro en el local"
        intro="Comprá online y pasá a buscarlo por el local. No pagás envío y te lo entregamos apenas está listo."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {datos.map((d, i) => {
            const inner = (
              <>
                <d.icon size={22} strokeWidth={1.4} className="text-accent" />
                <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ash">{d.label}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed">{d.value}</p>
              </>
            );
            return (
              <Reveal key={d.label} delay={i * 0.08} blur={false}>
                {d.href ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="h-full border border-line p-6">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16">
          <Article n={1} title="Cómo funciona">
            <ul>
              <li>Armá tu pedido y elegí <strong>Retiro en el local</strong> en el paso de entrega.</li>
              <li>El costo de envío pasa a $0 automáticamente.</li>
              <li>Te avisamos por WhatsApp cuando el pedido está listo.</li>
              <li>Pasá por el local con tu número de pedido y tu DNI.</li>
            </ul>
          </Article>

          <Article n={2} title="Cuánto tiempo lo guardamos">
            <p>
              Te guardamos el pedido <strong>7 días corridos</strong> desde que te avisamos que
              está listo. Si no podés venir en ese plazo, escribinos y lo coordinamos.
            </p>
          </Article>

          <Article n={3} title="¿Puedo probarme la prenda?">
            <p>
              Sí. Si al probártela no te convence el talle, lo cambiamos en el momento por otro
              disponible. Tené en cuenta que el local publica los talles que le quedan, así que
              puede que no haya stock del que buscás.
            </p>
          </Article>
        </div>

        <Reveal blur={false} className="mt-14">
          <div className="flex flex-col items-start gap-5 border border-line p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-normal">¿Todavía no elegiste?</p>
              <p className="mt-1 text-[14px] text-ash">
                Mirá el catálogo y reservá lo que quieras retirar.
              </p>
            </div>
            <Link
              href="/prendas"
              className="group btn-sheen inline-flex shrink-0 items-center gap-2 bg-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
            >
              <ShoppingBag size={15} strokeWidth={1.75} />
              Ver catálogo
            </Link>
          </div>
        </Reveal>
      </div>

      <ProductStrip eyebrow="Para retirar" title="Elegí lo que pasás a buscar" />
    </>
  );
}
