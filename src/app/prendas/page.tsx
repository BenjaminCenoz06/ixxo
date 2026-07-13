import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getAllProducts } from "@/lib/repository/products";

export const metadata: Metadata = {
  title: "Todas las prendas",
  description: "El catálogo completo de Custom Wear.",
};

export const dynamic = "force-dynamic";

export default async function PrendasPage() {
  const products = await getAllProducts();
  return (
    <CatalogView
      products={products}
      title="Todas las prendas"
      eyebrow="Catálogo"
      description="Explorá toda la colección de Custom Wear."
    />
  );
}
