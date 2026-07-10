"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Decide el "chrome" de la app según la ruta:
 * el panel /admin trae su propio layout (sin header/footer/carrito de la tienda).
 */
export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Loader />
      <SmoothScroll>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </SmoothScroll>
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
