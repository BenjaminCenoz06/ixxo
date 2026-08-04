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
import { getSiteContent } from "@/lib/repository/content";
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

  // Solo las fotos reales de la prenda. Antes se rellenaba con imágenes de
  // banco para llenar el riel, pero mostraban ropa que no es la que se vende.
  const gallery = product.images;

  const [related, allProducts, content] = await Promise.all([
    getRelated(product, 4),
    getAllProducts(),
    getSiteContent(),
  ]);
  const alsoLike = allProducts.filter((p) => p.id !== product.id).slice(-4);

  // El umbral sale del CMS, no hardcodeado: estaba escrito a mano en $90.000
  // mientras la barra de anuncios y el carrito usaban otro número, así que la
  // misma página se contradecía a sí misma.
  const umbral = content.general.freeShippingThreshold;
  const faq = [
    {
      q: "¿Cuánto tarda el envío?",
      a:
        `Hacemos envíos a domicilio todos los días. Entre 2 y 5 días hábiles a todo el país.` +
        (umbral > 0 ? ` Envío gratis en compras superiores a ${formatPrice(umbral)}.` : ""),
    },
    { q: "¿Puedo cambiar el talle?", a: "Sí, tenés 30 días para cambios sin cargo. Escribinos por WhatsApp y lo coordinamos." },
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
            // Materiales y cuidados sólo si el producto los tiene cargados.
            ...(product.materials?.length
              ? [
                  {
                    title: "Materiales",
                    content: (
                      <ul className="list-inside list-disc space-y-1">
                        {product.materials.map((m) => <li key={m}>{m}</li>)}
                      </ul>
                    ),
                  },
                ]
              : []),
            ...(product.care?.length
              ? [
                  {
                    title: "Cuidados",
                    content: (
                      <ul className="list-inside list-disc space-y-1">
                        {product.care.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    ),
                  },
                ]
              : []),
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
      {product.reviewCount > 0 && <ProductReviews product={product} />}
      <RelatedProducts
        eyebrow="Seguí explorando"
        title="También te puede interesar"
        products={alsoLike}
      />
    </>
  );
}
