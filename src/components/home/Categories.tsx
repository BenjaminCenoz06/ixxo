import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredCategories } from "@/data/categories";

export default function Categories() {
  return (
    <section className="container-ixxo py-20 md:py-28">
      <SectionHeading
        eyebrow="Explorá"
        title="Comprar por categoría"
        cta="Ver todas"
        ctaHref="/categorias"
      />
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {featuredCategories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-smoke md:aspect-[3/4]"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              priority={i < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent transition-opacity duration-500 group-hover:from-ink/70" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-paper">
              <div>
                <h3 className="font-display text-xl font-normal tracking-tight md:text-2xl">
                  {cat.name}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.16em] text-paper/70">
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
