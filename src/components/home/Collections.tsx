import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getCollections } from "@/lib/repository/catalog-meta";
import { cn } from "@/lib/utils";

export default async function Collections() {
  const collections = await getCollections();
  return (
    <section className="bg-smoke py-20 md:py-28">
      <div className="container-ixxo">
        <Reveal className="mb-14 max-w-xl">
          <p className="eyebrow mb-3">Colecciones</p>
          <h2 className="font-display text-3xl font-light leading-[1.05] tracking-tight md:text-[2.75rem]">
            Cada colección, un universo propio
          </h2>
        </Reveal>

        <div className="flex flex-col gap-4 md:gap-6">
          {collections.map((col) => (
            <Reveal key={col.slug} blur={false}>
              <Link
                href={`/coleccion/${col.slug}`}
                className="group relative flex aspect-[16/10] items-end overflow-hidden bg-ink md:aspect-[21/9]"
              >
                {col.image && (
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-90 transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div
                  className={cn(
                    "relative w-full p-7 text-paper md:p-12",
                    col.align === "right" && "text-right",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col gap-3",
                      col.align === "right" && "items-end",
                    )}
                  >
                    <h3 className="font-display text-3xl font-light tracking-tight md:text-5xl">
                      {col.title}
                    </h3>
                    <p className="max-w-sm text-sm text-paper/80">{col.subtitle}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em]">
                      Explorar
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
