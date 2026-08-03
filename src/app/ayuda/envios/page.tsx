import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Store, PackageCheck, Clock } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ProductStrip from "@/components/product/ProductStrip";
import { Article } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/repository/content";
import { SHIPPING_ZONES } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Envíos",
  description:
    "Costos, zonas y plazos de envío de GoodStyle. Envíos a todo el país y retiro sin cargo en el local de Ituzaingó, Corrientes.",
};

export const dynamic = "force-dynamic";

export default async function EnviosPage() {
  const content = await getSiteContent();
  const { shipping, general } = content;
  const umbral = general.freeShippingThreshold;

  return (
    <>
      <PageHero
        eyebrow="Ayuda"
        title="Envíos"
        intro="Hacemos envíos a todo el país y también podés retirar sin cargo por el local. Acá están los costos y los plazos por zona."
      />

      <div className="container-ixxo py-14 md:py-20">
        {umbral > 0 && (
          <Reveal blur={false}>
            <div className="mb-12 flex flex-col items-start gap-4 border border-accent/40 bg-accent/5 px-6 py-6 sm:flex-row sm:items-center sm:gap-6">
              <PackageCheck size={26} strokeWidth={1.4} className="shrink-0 text-accent" />
              <div>
                <p className="font-display text-xl font-normal">
                  Envío gratis desde {formatPrice(umbral)}
                </p>
                <p className="mt-1 text-[14px] text-ash">
                  Se aplica solo con superar ese monto, a cualquier zona del país.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Zonas y costos */}
        <Reveal blur={false}>
          <h2 className="font-display text-2xl font-light tracking-tight md:text-3xl">
            Costos por zona
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SHIPPING_ZONES.map((zona, i) => (
            <Reveal key={zona.key} delay={i * 0.07} blur={false}>
              <div className="group h-full border border-line p-6 transition-colors duration-300 hover:border-ash">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg">{zona.label}</h3>
                  <span className="font-display text-xl text-accent">
                    {formatPrice(shipping[zona.key])}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ash">
                  <Clock size={13} strokeWidth={1.6} />
                  Llega en {zona.minDays} a {zona.maxDays} días hábiles
                </p>
                <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-stone">
                  {zona.provinces.join(" · ")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Detalle */}
        <div className="mt-16">
          <Article n={1} title="Cómo despachamos">
            <p>
              Preparamos el pedido apenas confirmamos el pago. Si pagás por transferencia, el
              pedido queda en <strong>pendiente</strong> hasta que verificamos la acreditación.
            </p>
            <p>
              Los plazos de arriba son días hábiles y empiezan a contar desde el despacho, no
              desde la compra. No incluyen sábados, domingos ni feriados.
            </p>
          </Article>

          <Article n={2} title="Seguimiento">
            <p>
              Cuando despachamos te avisamos por mail y por WhatsApp al número que cargaste en
              el checkout. Ahí te pasamos el código de seguimiento.
            </p>
            <p>
              Si tenés dudas con un pedido en curso, escribinos por{" "}
              <a href={`https://wa.me/${general.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              con tu número de pedido.
            </p>
          </Article>

          <Article n={3} title="Retiro en el local">
            <p>
              Podés elegir <strong>retiro en el local</strong> en el checkout y el envío te sale
              $0. Te avisamos cuando el pedido está listo para que pases a buscarlo.
            </p>
            <p>
              <Link href="/ayuda/retiro">Ver dirección y horarios →</Link>
            </p>
          </Article>

          <Article n={4} title="Zona de cobertura">
            <p>
              Llegamos a todo el país. Si tu localidad no tiene entrega a domicilio, el paquete
              queda en la sucursal de correo más cercana y te avisamos.
            </p>
          </Article>
        </div>

        {/* Atajos */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <Reveal blur={false}>
            <Link
              href="/ayuda/retiro"
              className="group flex items-center gap-4 border border-line p-6 transition-colors duration-300 hover:border-ink"
            >
              <Store size={22} strokeWidth={1.4} className="shrink-0 text-ash transition-colors group-hover:text-ink" />
              <span>
                <span className="block font-medium">Retirar en el local</span>
                <span className="block text-[13px] text-ash">Sin costo de envío</span>
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.08} blur={false}>
            <Link
              href="/prendas"
              className="group flex items-center gap-4 border border-line p-6 transition-colors duration-300 hover:border-ink"
            >
              <Truck size={22} strokeWidth={1.4} className="shrink-0 text-ash transition-colors group-hover:text-ink" />
              <span>
                <span className="block font-medium">Ver el catálogo</span>
                <span className="block text-[13px] text-ash">Todas las prendas del local</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      <ProductStrip />
    </>
  );
}
