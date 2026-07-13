import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts } from "@/lib/repository/products";
import { editorial } from "@/data/images";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Outfits completos de Custom Wear. Inspirate y comprá el look entero.",
};

const looks = [
  { id: "look-1", title: "Urban Tailoring", desc: "Sastrería relajada para el día a día." },
  { id: "look-2", title: "Off Duty", desc: "Comodidad elevada, sin esfuerzo." },
  { id: "look-3", title: "Layered", desc: "Capas y texturas para el invierno." },
];

export default async function LookbookPage() {
  const products = await getAllProducts();

  return (
    <div className="pb-24 pt-28 md:pt-36">
      <header className="container-ixxo border-b border-line pb-8">
        <p className="eyebrow mb-3">Lookbook</p>
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
          Comprá el look completo
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-ash">
          Outfits armados por nuestro equipo de estilo. Sumá todas las prendas con un toque.
        </p>
      </header>

      <div className="mt-12 space-y-20 md:space-y-28">
        {looks.map((look, i) => {
          const items = products.slice(i * 3, i * 3 + 3);
          const flip = i % 2 === 1;
          return (
            <section
              key={look.id}
              className="container-ixxo grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal blur={false} className={cn(flip && "lg:order-2")}>
                <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                  <Image
                    src={editorial(look.id, 1200, 1500)}
                    alt={look.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </Reveal>

              <Reveal direction={flip ? "right" : "left"} className={cn(flip && "lg:order-1")}>
                <p className="eyebrow mb-3">Look 0{i + 1}</p>
                <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
                  {look.title}
                </h2>
                <p className="mt-3 text-[15px] text-ash">{look.desc}</p>

                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {items.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 py-4">
                      <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-smoke">
                        <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/producto/${p.slug}`} className="text-[14px] hover:text-ash">
                          {p.name}
                        </Link>
                        <p className="text-[13px] text-ash">{formatPrice(p.price)}</p>
                      </div>
                      <Link
                        href={`/producto/${p.slug}`}
                        aria-label={`Ver ${p.name}`}
                        className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ink"
                      >
                        <Plus size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>
          );
        })}
      </div>
    </div>
  );
}
