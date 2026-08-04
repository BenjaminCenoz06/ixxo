import type { Metadata } from "next";
import { Inter, Manrope, Fraunces } from "next/font/google";
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

/**
 * Tipografía SOLO del logotipo animado del header. Fraunces está dibujada a
 * partir de las serif display de los 70 (Windsor, Cooper, Souvenir): el eje
 * WONK activa las formas orgánicas y SOFT redondea las terminales, que es lo
 * que le da el aire del logo de GoodStyle. No se usa en ningún otro lado.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, general } = await getSiteContent();
  const brand = general.storeName?.replace(/\.$/, "") || "GoodStyle";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s · ${brand}`,
    },
    description: seo.description,
    keywords: seo.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "es_AR",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} ${fraunces.variable}`}>
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
