import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView from "@/components/catalog/CatalogView";
import {
  getProductsByCategory,
  getNewArrivals,
  getOnSale,
} from "@/lib/repository/products";
import { categories } from "@/data/categories";

type Params = { params: Promise<{ slug: string }> };

const EXTRA: Record<string, { name: string; eyebrow: string; description: string }> = {
  novedades: {
    name: "Novedades",
    eyebrow: "Recién llegado",
    description: "Lo último que sumamos a la colección. Piezas nuevas cada semana.",
  },
  ofertas: {
    name: "Ofertas",
    eyebrow: "Precios especiales",
    description: "Selección de prendas con descuento por tiempo limitado.",
  },
};

function resolveInfo(slug: string) {
  if (slug === "novedades") return EXTRA.novedades;
  if (slug === "ofertas") return EXTRA.ofertas;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    name: cat.name,
    eyebrow: "Categoría",
    description: `Explorá nuestra selección de ${cat.name.toLowerCase()} de diseño.`,
  };
}

async function resolveList(slug: string) {
  if (slug === "novedades") return getNewArrivals();
  if (slug === "ofertas") return getOnSale();
  return getProductsByCategory(slug);
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const info = resolveInfo(slug);
  if (!info) return { title: "Categoría" };
  return { title: info.name, description: info.description };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const info = resolveInfo(slug);
  if (!info) notFound();

  const list = await resolveList(slug);

  return (
    <CatalogView
      products={list}
      title={info.name}
      eyebrow={info.eyebrow}
      description={info.description}
    />
  );
}
