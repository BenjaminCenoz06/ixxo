import type { Metadata } from "next";
import FavoritesView from "@/components/account/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function FavoritosPage() {
  return <FavoritesView />;
}
