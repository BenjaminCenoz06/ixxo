import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/config";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/cuenta", "/favoritos", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
