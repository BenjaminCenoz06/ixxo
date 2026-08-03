import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Article, Notice } from "@/components/ui/Prose";
import { getSiteContent } from "@/lib/repository/content";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de compra en GoodStyle, Ituzaingó, Corrientes.",
};

export const dynamic = "force-dynamic";

export default async function TerminosPage() {
  const { general } = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Términos y condiciones"
        intro="Condiciones que rigen las compras hechas en este sitio."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="max-w-3xl">
          <Notice>
            Borrador pendiente de revisión profesional. El contenido refleja cómo opera el local
            hoy, pero conviene que un abogado o contador lo valide antes de considerarlo
            definitivo.
          </Notice>

          <div className="mt-8">
            <Article n={1} title="Quiénes somos">
              <p>
                GoodStyle es un comercio de indumentaria masculina con local en{" "}
                <strong>{general.address}</strong>. Vendemos de forma presencial y a través de
                este sitio, con envíos a todo el país.
              </p>
              <p>
                Contacto: WhatsApp{" "}
                <a href={`https://wa.me/${general.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  +54 9 3786 41-1223
                </a>
                {general.email && <> · {general.email}</>}.
              </p>
            </Article>

            <Article n={2} title="Precios y disponibilidad">
              <p>
                Los precios están expresados en <strong>pesos argentinos</strong> e incluyen IVA.
                Pueden modificarse sin aviso previo; el precio que rige es el vigente al momento
                de confirmar el pedido.
              </p>
              <p>
                El stock es real y limitado: el local publica las unidades que le quedan por
                talle. Si un producto se agota entre que lo agregás al carrito y confirmás la
                compra, te avisamos y te devolvemos el importe.
              </p>
            </Article>

            <Article n={3} title="Formas de pago">
              <p>
                Aceptamos <strong>transferencia bancaria</strong> y{" "}
                <strong>Mercado Pago por alias</strong>, además de efectivo si retirás por el
                local. El pedido queda en estado pendiente hasta que verificamos la acreditación
                del pago.
              </p>
            </Article>

            <Article n={4} title="Envíos y plazos">
              <p>
                Hacemos envíos a todo el país.
                {general.freeShippingThreshold > 0 && (
                  <> El envío es sin cargo en compras superiores a {formatPrice(general.freeShippingThreshold)}.</>
                )}{" "}
                Los costos y plazos por zona están detallados en{" "}
                <Link href="/ayuda/envios">Envíos</Link>.
              </p>
              <p>
                Los plazos son estimados en días hábiles desde el despacho y dependen del correo.
                No respondemos por demoras ajenas a nosotros, pero te acompañamos con el
                seguimiento.
              </p>
            </Article>

            <Article n={5} title="Cambios">
              <p>
                Cambiamos prendas <strong>sin uso, con su etiqueta</strong> y dentro de los{" "}
                <strong>30 días corridos</strong> de recibidas, sujeto a stock disponible. Los
                cambios se coordinan por WhatsApp y se hacen en el local.
              </p>
              <p>
                Por razones de higiene no se cambian prendas íntimas ni accesorios de uso
                personal, salvo defecto de fábrica.
              </p>
            </Article>

            <Article n={6} title="Derecho de arrepentimiento">
              <p>
                Si comprás a distancia, tenés <strong>10 días corridos</strong> desde que recibís
                el producto para arrepentirte, sin costo ni justificación, conforme al art. 34 de
                la Ley 24.240.
              </p>
              <p>
                <Link href="/legales/arrepentimiento">Ejercer el botón de arrepentimiento →</Link>
              </p>
            </Article>

            <Article n={7} title="Garantía y defectos">
              <p>
                Si la prenda llega con un defecto de fábrica, escribinos dentro de las{" "}
                <strong>48 horas</strong> de recibida con fotos del problema. La reemplazamos por
                otra igual o, si no hay stock, te devolvemos el importe.
              </p>
            </Article>

            <Article n={8} title="Fotos y descripciones">
              <p>
                Las fotos son de las prendas reales del local. Puede haber diferencias de tono
                según la pantalla desde la que mires el sitio. Las medidas publicadas son
                aproximadas: ver <Link href="/ayuda/talles">Guía de talles</Link>.
              </p>
            </Article>

            <Article n={9} title="Cuenta de usuario">
              <p>
                Podés comprar con o sin cuenta. Si creás una, sos responsable de mantener la
                confidencialidad de tus credenciales y de la actividad hecha desde tu cuenta.
              </p>
            </Article>

            <Article n={10} title="Jurisdicción">
              <p>
                Estas condiciones se rigen por las leyes de la República Argentina. Ante cualquier
                controversia serán competentes los tribunales ordinarios de la Provincia de
                Corrientes, sin perjuicio de los derechos que la Ley de Defensa del Consumidor le
                reconoce al comprador.
              </p>
              <p>
                <Link href="/legales/defensa-consumidor">Información para consumidores →</Link>
              </p>
            </Article>
          </div>
        </div>
      </div>
    </>
  );
}
