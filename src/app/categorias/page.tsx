import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getCategories } from "@/lib/repository/catalog-meta";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Todas las categorías de GoodStyle: jeans, bermudas, buzos, remeras, zapatillas y accesorios.",
};

export const dynamic = "force-dynamic";

/**
 * Listado completo de categorías.
 *
 * El home muestra solo las primeras seis, y el enlace "Ver todas" apuntaba
 * acá desde siempre: la ruta no existía y daba 404. Además era el único lugar
 * donde podía verse una categoría nueva creada desde el panel, porque en el
 * home no entra hasta que alguna de las seis le deje el lugar.
 */
export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Categorías"
        intro="Todo lo que hay en el local, ordenado por tipo de prenda."
      />

      <div className="container-ixxo py-14 md:py-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.05} blur={false}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-smoke md:aspect-[3/4]"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    priority={i < 3}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/25 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-onmedia">
                  <div>
                    <h2 className="font-brand text-xl font-normal tracking-tight md:text-2xl">
                      {cat.name}
                    </h2>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-onmedia/85">
                      {cat.count} {cat.count === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="py-16 text-center text-[14px] text-ash">
            Todavía no hay categorías cargadas.
          </p>
        )}
      </div>
    </>
  );
}
