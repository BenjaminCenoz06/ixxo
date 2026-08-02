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
        "@type": "ClothingStore",
        name: "GoodStyle",
        description: "Tienda de ropa de hombre en Ituzaingó, Corrientes.",
        url: base,
        logo: `${base}/icon.png`,
        image: `${base}/icon.png`,
        telephone: "+543786411223",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Mariano Moreno",
          addressLocality: "Ituzaingó",
          addressRegion: "Corrientes",
          postalCode: "W3407",
          addressCountry: "AR",
        },
        geo: { "@type": "GeoCoordinates", latitude: -27.5900888, longitude: -56.6941168 },
        hasMap:
          "https://www.google.com/maps/place/GoodStyle/@-27.590084,-56.6966917,17z",
        aggregateRating: { "@type": "AggregateRating", ratingValue: 5, reviewCount: 1 },
        sameAs: ["https://www.instagram.com/good.style.ok/"],
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
        name: "GoodStyle",
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
        brand: { "@type": "Brand", name: "GoodStyle" },
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
