import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export default function RelatedProducts({
  title,
  eyebrow,
  products,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section className="container-ixxo py-16 md:py-20">
      <Reveal className="mb-10">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-light tracking-tight md:text-3xl">{title}</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
