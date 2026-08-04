import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories } from "@/lib/repository/catalog-meta";

export default async function Categories({
  heading,
}: {
  heading: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
}) {
  // TODAS las categorías, no las primeras seis. Con el tope fijo, el dueño
  // creaba una categoría desde el panel y no aparecía en ningún lado: la
  // séptima quedaba afuera del home y /categorias todavía no existía.
  const featuredCategories = await getCategories();
  return (
    <section className="container-ixxo py-20 md:py-28">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        cta={heading.ctaLabel}
        ctaHref={heading.ctaHref}
      />
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {featuredCategories.map((cat, i) => (
          <Link
            key={cat.slug}
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
                priority={i < 2}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/25 to-transparent transition-opacity duration-500 group-hover:from-scrim/90" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-onmedia">
              <div>
                <h3 className="font-display text-xl font-normal tracking-tight md:text-2xl">
                  {cat.name}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.16em] text-onmedia/85">
                  {cat.count} productos
                </p>
              </div>
              <span className="translate-x-2 text-lg opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
