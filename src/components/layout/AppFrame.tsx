"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import BottomNav from "@/components/layout/BottomNav";

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
        {/* pb-16 deja lugar a la barra inferior fija en móvil */}
        <div className="pb-16 lg:pb-0">
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
      <CartDrawer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}
