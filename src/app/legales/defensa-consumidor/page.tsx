import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MessageCircle, ScrollText } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Article } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/repository/content";

export const metadata: Metadata = {
  title: "Defensa al consumidor",
  description:
    "Información para consumidores de GoodStyle: cómo reclamar, dónde denunciar y el enlace oficial a Defensa de las y los Consumidores.",
};

export const dynamic = "force-dynamic";

const enlaces = [
  {
    icon: ScrollText,
    title: "Ventanilla Única Federal",
    desc: "Portal oficial para iniciar un reclamo contra un comercio.",
    href: "https://autogestion.produccion.gob.ar/consumidores",
  },
  {
    icon: ExternalLink,
    title: "Ley 24.240 — Defensa del Consumidor",
    desc: "Texto completo de la ley en el sistema de información normativa.",
    href: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm",
  },
];

export default async function DefensaConsumidorPage() {
  const { general } = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Defensa al consumidor"
        intro="Si tenés un problema con una compra, primero escribinos: casi todo se resuelve rápido. Si aun así querés hacer un reclamo formal, acá están los canales oficiales."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="max-w-3xl">
          <Reveal blur={false}>
            <a
              href={`https://wa.me/${general.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 border border-accent/40 bg-accent/5 p-6 transition-all duration-300 hover:-translate-y-0.5 md:p-8"
            >
              <MessageCircle size={26} strokeWidth={1.4} className="shrink-0 text-accent" />
              <span>
                <span className="block font-display text-xl font-normal">Escribinos primero</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-ash">
                  Contanos qué pasó por WhatsApp con tu número de pedido. Respondemos en el día.
                </span>
              </span>
            </a>
          </Reveal>

          <div className="mt-12">
            <Article n={1} title="Tus derechos como consumidor">
              <p>
                La <strong>Ley 24.240</strong> te protege en toda relación de consumo. Entre otras
                cosas te garantiza información veraz sobre lo que comprás, condiciones de
                contratación claras, y el derecho a revocar una compra a distancia.
              </p>
              <p>
                <Link href="/legales/arrepentimiento">
                  Ejercer el botón de arrepentimiento (10 días) →
                </Link>
              </p>
            </Article>

            <Article n={2} title="Cómo hacer un reclamo formal">
              <p>
                Si no llegamos a una solución, podés iniciar un reclamo en la{" "}
                <strong>Ventanilla Única Federal de Defensa de las y los Consumidores</strong>. Es
                gratuito y se hace en línea.
              </p>
              <p>
                También podés acudir a la autoridad de aplicación local de la Provincia de
                Corrientes, o al municipio de Ituzaingó.
              </p>
            </Article>

            <Article n={3} title="Datos del comercio">
              <p>
                Razón comercial: <strong>GoodStyle</strong>
                <br />
                Domicilio: {general.address}
                <br />
                WhatsApp: +54 9 3786 41-1223
                {general.email && (
                  <>
                    <br />
                    Correo: {general.email}
                  </>
                )}
              </p>
            </Article>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {enlaces.map((e, i) => (
              <Reveal key={e.href} delay={i * 0.08} blur={false}>
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col border border-line p-6 transition-colors duration-300 hover:border-ink"
                >
                  <e.icon size={20} strokeWidth={1.4} className="text-ash transition-colors group-hover:text-ink" />
                  <span className="mt-4 block font-medium">{e.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ash">{e.desc}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
