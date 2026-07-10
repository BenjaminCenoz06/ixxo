import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView from "@/components/catalog/CatalogView";
import { getAllProducts } from "@/lib/repository/products";
import { collections } from "@/data/collections";

type Params = { params: Promise<{ slug: string }> };

// El slug de la colección → el nombre usado en el campo `collection` del producto.
const COLLECTION_NAME: Record<string, string> = {
  essentials: "Essentials",
  tailoring: "Tailoring",
  "winter-26": "Winter 26",
};

export const revalidate = 3600;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const col = collections.find((c) => c.slug === slug);
  if (!col) return { title: "Colección" };
  return { title: col.title, description: col.subtitle ?? undefined };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const col = collections.find((c) => c.slug === slug);
  if (!col) notFound();

  const name = COLLECTION_NAME[slug];
  const all = await getAllProducts();
  const products = all.filter((p) => p.collection === name);

  return (
    <CatalogView
      products={products}
      title={col.title}
      eyebrow="Colección"
      description={col.subtitle ?? undefined}
    />
  );
}
