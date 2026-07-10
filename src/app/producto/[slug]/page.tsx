import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/product/Gallery";
import ProductInfo from "@/components/product/ProductInfo";
import Accordion from "@/components/product/Accordion";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import {
  getProductBySlug,
  getRelated,
  getAllProducts,
  allProductSlugs,
} from "@/lib/repository/products";
import { editorial } from "@/data/images";
import { formatPrice } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return allProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: `${product.name} — ${formatPrice(product.price)}. ${product.description ?? ""}`,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const gallery = [
    ...product.images,
    editorial(`${product.id}-c`),
    editorial(`${product.id}-d`),
  ];

  const [related, allProducts] = await Promise.all([getRelated(product, 4), getAllProducts()]);
  const alsoLike = allProducts.filter((p) => p.id !== product.id).slice(-4);

  const faq = [
    { q: "¿Cuánto tarda el envío?", a: "Entre 2 y 5 días hábiles a todo el país. Envío gratis en compras superiores a $90.000." },
    { q: "¿Puedo cambiar el talle?", a: "Sí, tenés 30 días para cambios sin cargo. Gestionás todo online desde tu cuenta." },
    { q: "¿Cómo sé mi talle?", a: "Consultá la guía de talles junto al selector. Ante la duda, elegí el talle mayor." },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="container-ixxo pt-28 md:pt-36">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: product.category, href: `/categoria/${product.categorySlug}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Galería + compra */}
      <div className="container-ixxo grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Gallery images={gallery} name={product.name} />
        </div>
        <ProductInfo product={product} />
      </div>

      {/* Detalle */}
      <div className="container-ixxo max-w-3xl pb-8">
        <Accordion
          items={[
            { title: "Descripción", content: <p>{product.description}</p> },
            {
              title: "Materiales",
              content: (
                <ul className="list-inside list-disc space-y-1">
                  {product.materials?.map((m) => <li key={m}>{m}</li>)}
                </ul>
              ),
            },
            {
              title: "Cuidados",
              content: (
                <ul className="list-inside list-disc space-y-1">
                  {product.care?.map((c) => <li key={c}>{c}</li>)}
                </ul>
              ),
            },
            {
              title: "Preguntas frecuentes",
              content: (
                <dl className="space-y-4">
                  {faq.map((f) => (
                    <div key={f.q}>
                      <dt className="font-medium text-ink">{f.q}</dt>
                      <dd className="mt-1">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
          ]}
        />
      </div>

      <RelatedProducts eyebrow="Completá el look" title="Combina con" products={related} />
      <ProductReviews product={product} />
      <RelatedProducts
        eyebrow="Seguí explorando"
        title="También te puede interesar"
        products={alsoLike}
      />
    </>
  );
}
