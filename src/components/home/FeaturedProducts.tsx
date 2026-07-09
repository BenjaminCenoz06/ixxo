import { SectionHeading } from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { getFeatured } from "@/lib/repository/products";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeatured();
  return (
    <section className="container-ixxo py-20 md:py-28">
      <SectionHeading
        eyebrow="Selección"
        title="Productos destacados"
        cta="Ver todo"
        ctaHref="/novedades"
      />
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {featuredProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
