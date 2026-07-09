import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { QueryProvider } from "@/lib/query-provider";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ixxo.com"),
  title: {
    default: "IXXO — Ropa masculina de diseño",
    template: "%s · IXXO",
  },
  description:
    "IXXO. Ropa masculina de diseño: prendas atemporales, materiales nobles y una experiencia de compra pensada al detalle. Envíos a todo el país.",
  keywords: ["ropa masculina", "moda hombre", "indumentaria premium", "IXXO"],
  openGraph: {
    title: "IXXO — Ropa masculina de diseño",
    description: "Prendas atemporales, materiales nobles, experiencia premium.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <Loader />
                <SmoothScroll>
                  <Header />
                  <main>{children}</main>
                  <Footer />
                </SmoothScroll>
                <CartDrawer />
                <WhatsAppButton />
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
