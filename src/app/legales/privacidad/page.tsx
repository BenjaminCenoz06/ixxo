import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Article, Notice } from "@/components/ui/Prose";
import { getSiteContent } from "@/lib/repository/content";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo GoodStyle trata los datos personales de sus clientes.",
};

export const dynamic = "force-dynamic";

export default async function PrivacidadPage() {
  const { general } = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Política de privacidad"
        intro="Qué datos te pedimos, para qué los usamos y cómo podés darlos de baja."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="max-w-3xl">
          <Notice>
            Borrador pendiente de revisión profesional. Describe el funcionamiento actual del
            sitio; conviene validarlo antes de considerarlo definitivo.
          </Notice>

          <div className="mt-8">
            <Article n={1} title="Qué datos recolectamos">
              <ul>
                <li>
                  <strong>Para procesar tu pedido:</strong> nombre, apellido, correo, teléfono,
                  domicilio de entrega, localidad, provincia y código postal.
                </li>
                <li>
                  <strong>Si pedís factura:</strong> razón social y CUIT.
                </li>
                <li>
                  <strong>Si creás una cuenta:</strong> tu correo y una contraseña, que se guarda
                  cifrada y nunca en texto plano.
                </li>
                <li>
                  <strong>Si te suscribís al newsletter:</strong> únicamente tu correo.
                </li>
              </ul>
            </Article>

            <Article n={2} title="Para qué los usamos">
              <p>
                Exclusivamente para preparar y despachar tu pedido, avisarte de su estado,
                responder consultas y emitir comprobantes. Si te suscribiste al newsletter,
                también para enviarte novedades del local.
              </p>
              <p>
                <strong>No vendemos ni cedemos tus datos a terceros</strong> con fines
                publicitarios.
              </p>
            </Article>

            <Article n={3} title="Con quién los compartimos">
              <ul>
                <li>
                  <strong>El correo o transporte</strong> que despacha tu pedido, con los datos
                  mínimos necesarios para la entrega.
                </li>
                <li>
                  <strong>La plataforma de pago</strong>, cuando abonás por Mercado Pago. En ese
                  caso los datos de pago los procesa Mercado Pago con sus propias políticas:
                  nosotros no almacenamos números de tarjeta.
                </li>
                <li>
                  <strong>Los proveedores de infraestructura</strong> que alojan el sitio y la
                  base de datos.
                </li>
              </ul>
            </Article>

            <Article n={4} title="Cookies y almacenamiento local">
              <p>
                Usamos almacenamiento del navegador para recordar tu carrito, tus favoritos y tu
                sesión si iniciaste una. No usamos cookies de publicidad ni de seguimiento entre
                sitios.
              </p>
              <p>
                Podés borrarlos desde la configuración de tu navegador. Si lo hacés, perdés el
                carrito guardado.
              </p>
            </Article>

            <Article n={5} title="Cuánto tiempo los guardamos">
              <p>
                Conservamos los datos de pedidos mientras sean necesarios para cumplir
                obligaciones comerciales, contables e impositivas. Los datos del newsletter, hasta
                que pidas la baja.
              </p>
            </Article>

            <Article n={6} title="Tus derechos">
              <p>
                Podés pedirnos en cualquier momento <strong>acceder</strong> a los datos que
                tenemos tuyos, <strong>rectificarlos</strong> o solicitar su{" "}
                <strong>supresión</strong>. Escribinos por{" "}
                <a href={`https://wa.me/${general.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                {general.email && <> o a {general.email}</>} y lo resolvemos.
              </p>
              <p>
                La Agencia de Acceso a la Información Pública, en su carácter de órgano de
                control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos
                que se interpongan con relación al incumplimiento de las normas sobre protección
                de datos personales.
              </p>
            </Article>

            <Article n={7} title="Seguridad">
              <p>
                El sitio se sirve por conexión cifrada (HTTPS). Aun así, ningún sistema es
                infalible: si detectás algo raro con tu cuenta, avisanos enseguida.
              </p>
            </Article>
          </div>
        </div>
      </div>
    </>
  );
}
