import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { editorialWide } from "@/data/images";

export default function Editorial() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-paper">
      <Image
        src={editorialWide("editorial-bg", 2000, 1200)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="container-ixxo relative py-28 text-center">
        <Reveal>
          <p className="eyebrow mb-6 text-paper/60">Filosofía IXXO</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.75rem)] font-light leading-[1.1] tracking-tight">
            No seguimos tendencias. Diseñamos prendas que no pasan de moda, con la calidad de lo que
            se hace bien.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-paper/70">
            Materiales seleccionados, confección responsable y un compromiso con el detalle que se
            siente en cada puntada.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
