import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getNewArrivals } from "@/lib/repository/products";

export const metadata: Metadata = {
  title: "Novedades",
  description: "Lo último de Custom Wear. Ingresos nuevos cada semana.",
};

export const dynamic = "force-dynamic";

export default async function NovedadesPage() {
  const products = await getNewArrivals();
  return (
    <CatalogView
      products={products}
      title="Novedades"
      eyebrow="Recién llegado"
      description="Lo último que sumamos a la colección. Piezas nuevas cada semana."
    />
  );
}
