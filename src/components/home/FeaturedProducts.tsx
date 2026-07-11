import { SectionHeading } from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { getFeatured } from "@/lib/repository/products";

export default async function FeaturedProducts({
  heading,
}: {
  heading: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
}) {
  const featuredProducts = await getFeatured();
  return (
    <section className="container-ixxo py-20 md:py-28">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        cta={heading.ctaLabel}
        ctaHref={heading.ctaHref}
      />
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {featuredProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
