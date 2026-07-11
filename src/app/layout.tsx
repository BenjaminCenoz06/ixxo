import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import AppFrame from "@/components/layout/AppFrame";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { ThemeStyle } from "@/components/ThemeStyle";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { QueryProvider } from "@/lib/query-provider";
import { SiteContentProvider } from "@/lib/site-content-context";
import { getSiteContent } from "@/lib/repository/content";
import { SITE_URL } from "@/lib/supabase/config";

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
  metadataBase: new URL(SITE_URL),
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <ThemeStyle theme={content.theme} />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Saltar al contenido
        </a>
        <QueryProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <SiteContentProvider content={content}>
                  <AppFrame>{children}</AppFrame>
                </SiteContentProvider>
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
