import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ArrepentimientoForm from "@/components/legal/ArrepentimientoForm";
import { Article } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Botón de arrepentimiento",
  description:
    "Cancelá tu compra dentro de los 10 días corridos de recibida, sin costo ni justificación, conforme al art. 34 de la Ley 24.240.",
};

export default function ArrepentimientoPage() {
  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Botón de arrepentimiento"
        intro="Si comprás a distancia, tenés 10 días corridos desde que recibís el producto para arrepentirte, sin costo y sin tener que explicar por qué."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="max-w-3xl">
          <Reveal blur={false}>
            <ArrepentimientoForm />
          </Reveal>

          <div className="mt-14">
            <Article n={1} title="Qué dice la ley">
              <p>
                El art. 34 de la <strong>Ley 24.240</strong> de Defensa del Consumidor establece
                que en las operaciones a distancia el consumidor puede revocar la aceptación
                durante <strong>10 días corridos</strong> contados desde la entrega del producto,
                sin responsabilidad alguna y sin necesidad de justificar la decisión.
              </p>
              <p>
                La <strong>Resolución 424/2020</strong> obliga a los sitios de venta online a
                ofrecer este botón de forma visible y accesible. Esta página cumple con esa
                obligación.
              </p>
            </Article>

            <Article n={2} title="Cómo lo hacemos efectivo">
              <ul>
                <li>Completás el formulario de arriba con tu número de pedido.</li>
                <li>Te confirmamos la recepción de la solicitud.</li>
                <li>Coordinamos el retiro del producto sin cargo para vos.</li>
                <li>
                  Una vez recibido, te devolvemos el importe por el mismo medio que pagaste,
                  dentro de los plazos que fija la normativa.
                </li>
              </ul>
            </Article>

            <Article n={3} title="Condiciones del producto">
              <p>
                El producto tiene que estar <strong>sin uso</strong> y en las mismas condiciones
                en que lo recibiste. Los gastos de devolución corren por nuestra cuenta.
              </p>
            </Article>

            <Article n={4} title="Si compraste en el local">
              <p>
                El derecho de arrepentimiento aplica a las compras a distancia. Si compraste
                presencialmente en el local, seguís teniendo el{" "}
                <Link href="/legales/terminos">régimen de cambios</Link>: 30 días corridos para
                cambiar prendas sin uso y con etiqueta, sujeto a stock.
              </p>
            </Article>
          </div>
        </div>
      </div>
    </>
  );
}
