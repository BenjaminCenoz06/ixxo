import type { Metadata } from "next";
import { Ruler } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ProductStrip from "@/components/product/ProductStrip";
import { Article } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { TOP_SIZES, BOTTOM_SIZES } from "@/data/sizes";

export const metadata: Metadata = {
  title: "Guía de talles",
  description:
    "Tabla de talles de GoodStyle: remeras, buzos y chombas por talle, y jeans y bermudas por talle numérico argentino.",
};

export default function TallesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ayuda"
        title="Guía de talles"
        intro="Medí una prenda que ya tengas y que te calce como te gusta, y compará con estas tablas. Es más confiable que medirte el cuerpo."
      />

      <div className="container-ixxo py-14 md:py-20">
        {/* Parte superior */}
        <Reveal blur={false}>
          <div className="flex items-center gap-3">
            <Ruler size={20} strokeWidth={1.5} className="text-accent" />
            <h2 className="font-display text-2xl font-light tracking-tight md:text-3xl">
              Remeras, buzos y chombas
            </h2>
          </div>
          <p className="mt-2 text-[14px] text-ash">Medidas de la prenda en centímetros.</p>
        </Reveal>

        <Reveal blur={false} className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-[14px]">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-3 font-medium">Talle</th>
                <th className="py-3 font-medium">Pecho</th>
                <th className="py-3 font-medium">Cintura</th>
                <th className="py-3 font-medium">Largo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TOP_SIZES.map((r) => (
                <tr key={r.size} className="transition-colors hover:bg-smoke/50">
                  <td className="py-3 font-medium">{r.size}</td>
                  <td className="py-3 text-ash">{r.chest}</td>
                  <td className="py-3 text-ash">{r.waist}</td>
                  <td className="py-3 text-ash">{r.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Parte inferior */}
        <Reveal blur={false} className="mt-16">
          <div className="flex items-center gap-3">
            <Ruler size={20} strokeWidth={1.5} className="text-accent" />
            <h2 className="font-display text-2xl font-light tracking-tight md:text-3xl">
              Jeans y bermudas
            </h2>
          </div>
          <p className="mt-2 text-[14px] text-ash">
            Talle numérico argentino. El número es la cintura de la prenda.
          </p>
        </Reveal>

        <Reveal blur={false} className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[22rem] max-w-md text-[14px]">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-3 font-medium">Talle</th>
                <th className="py-3 font-medium">Cintura (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {BOTTOM_SIZES.map((r) => (
                <tr key={r.size} className="transition-colors hover:bg-smoke/50">
                  <td className="py-3 font-medium">{r.size}</td>
                  <td className="py-3 text-ash">{r.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <div className="mt-16">
          <Article n={1} title="Cómo medir">
            <ul>
              <li>
                <strong>Pecho:</strong> apoyá la prenda estirada y medí de axila a axila.
                Multiplicá por dos.
              </li>
              <li>
                <strong>Cintura:</strong> medí el ancho de la cintura de la prenda cerrada y
                multiplicá por dos.
              </li>
              <li>
                <strong>Largo:</strong> desde el hombro, al lado del cuello, hasta el borde de
                abajo.
              </li>
            </ul>
          </Article>

          <Article n={2} title="Los cortes baggy calzan holgados">
            <p>
              Buena parte del catálogo es <strong>baggy, semi baggy y oversize</strong>. Están
              pensados para quedar sueltos: si querés ese calce, mantené tu talle habitual. Si
              lo preferís más ajustado, bajá un talle.
            </p>
          </Article>

          <Article n={3} title="Tolerancia">
            <p>
              Las medidas son aproximadas y pueden variar <strong>±2 cm</strong> según la prenda
              y el lote. Ante la duda entre dos talles, elegí el mayor.
            </p>
          </Article>

          <Article n={4} title="¿Te quedó dudando?">
            <p>
              Escribinos por WhatsApp con la prenda que te interesa y te decimos las medidas
              exactas de la unidad que tenemos en el local. Cada prenda se publica con los
              talles que quedan en stock.
            </p>
          </Article>
        </div>
      </div>

      <ProductStrip eyebrow="Probá con estas" title="Prendas con varios talles" />
    </>
  );
}
