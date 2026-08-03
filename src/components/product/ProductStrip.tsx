import { SectionHeading } from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getFeatured } from "@/lib/repository/products";

/**
 * Franja de productos para el pie de las páginas informativas y legales:
 * evita que el cliente llegue a un callejón sin salida.
 */
export default async function ProductStrip({
  eyebrow = "Seguí mirando",
  title = "Lo más buscado del local",
  count = 4,
}: {
  eyebrow?: string;
  title?: string;
  count?: number;
}) {
  const products = (await getFeatured()).slice(0, count);
  if (!products.length) return null;

  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="container-ixxo">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          cta="Ver todo el catálogo"
          ctaHref="/prendas"
        />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} blur={false}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
