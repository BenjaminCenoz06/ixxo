import type { Product } from "@/types";
import { SITE_URL } from "@/lib/supabase/config";

const base = SITE_URL.replace(/\/$/, "");

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD estático; no hay input de usuario sin escapar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "IXXO",
        url: base,
        logo: `${base}/icon.png`,
        sameAs: ["https://instagram.com/ixxo", "https://tiktok.com/@ixxo"],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "IXXO",
        url: base,
        potentialAction: {
          "@type": "SearchAction",
          target: `${base}/prendas?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: product.description,
        category: product.category,
        brand: { "@type": "Brand", name: "IXXO" },
        aggregateRating:
          product.reviewCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              }
            : undefined,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "ARS",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${base}/producto/${product.slug}`,
        },
      }}
    />
  );
}
