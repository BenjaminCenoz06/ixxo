import { editorial, editorialWide } from "@/data/images";
import { reviews as defaultReviews, reviewStats } from "@/data/reviews";
import { navItems as defaultNav } from "@/data/nav";

export interface NavItemContent {
  label: string;
  href: string;
  mega?: { heading: string; links: { label: string; href: string }[] }[];
  featured?: { title: string; image: string; href: string };
}

/** Contenido editable del sitio (CMS). Todo esto se puede cambiar desde /admin/contenido. */
export interface SiteContent {
  announcement: string[];
  hero: {
    titleTop: string;
    titleBottom: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
    slides: { image: string; imageMobile?: string; eyebrow: string }[];
  };
  newCollection: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    ctaLabel: string;
    ctaHref: string;
  };
  editorial: {
    eyebrow: string;
    quote: string;
    subtext: string;
    image: string;
  };
  newsletter: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  footer: {
    description: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  sections: {
    categories: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
    featured: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
    collections: { eyebrow: string; title: string };
    lookbook: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
    reviews: { eyebrow: string; title: string };
  };
  lookbook: {
    looks: { image: string; title: string; items: number }[];
  };
  homeCollections: { image: string; title: string; subtitle: string; href: string }[];
  instagram: {
    eyebrow: string;
    handle: string;
    url: string;
    images: string[];
  };
  reviews: {
    average: number;
    count: number;
    items: { author: string; rating: number; title: string; body: string; product: string; avatar: string }[];
  };
  theme: {
    accent: string;
    ink: string;
    paper: string;
  };
  general: {
    storeName: string;
    whatsapp: string;
    freeShippingThreshold: number;
    transferDiscount: number;
  };
  coupons: { code: string; label: string; type: "percent" | "fixed"; value: number }[];
  footerColumns: { title: string; links: { label: string; href: string }[] }[];
  payments: string[];
  nav: NavItemContent[];
}

export const DEFAULT_CONTENT: SiteContent = {
  announcement: [
    "Envío a todo el país",
    "Precios mayoristas y minoristas",
    "Hasta 6 cuotas sin interés",
    "15% OFF pagando por transferencia",
  ],
  hero: {
    titleTop: "Estilo",
    titleBottom: "urbano.",
    ctaPrimaryLabel: "Ver catálogo",
    ctaPrimaryHref: "/novedades",
    ctaSecondaryLabel: "Colecciones",
    ctaSecondaryHref: "/colecciones",
    slides: [
      { image: editorialWide("hero-1", 2000, 1200), eyebrow: "Nueva temporada 2026" },
      { image: editorialWide("hero-2", 2000, 1200), eyebrow: "Indumentaria urbana" },
      { image: editorialWide("hero-3", 2000, 1200), eyebrow: "Mayorista y minorista" },
    ],
  },
  newCollection: {
    eyebrow: "Nueva temporada",
    title: "Colección 2026",
    description:
      "Las últimas tendencias en indumentaria urbana. Prendas cómodas, versátiles y con impronta propia, pensadas para tu día a día en la ciudad.",
    image: editorialWide("newcol", 1200, 1400),
    ctaLabel: "Ver la colección",
    ctaHref: "/novedades",
  },
  editorial: {
    eyebrow: "Filosofía Custom Wear",
    quote:
      "Vestí tu identidad. Streetwear con actitud, hecho para moverse con vos por las calles de Córdoba.",
    subtext:
      "Diseño urbano, calidad en cada prenda y atención cercana. Mayorista y minorista, con envíos a todo el país.",
    image: editorialWide("editorial-bg", 2000, 1200),
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: "Sumate a la comunidad Custom Wear",
    subtitle: "Enterate primero de los nuevos ingresos, promos y un 10% en tu primera compra.",
  },
  footer: {
    description:
      "Indumentaria urbana en Córdoba, Argentina. Mayorista y minorista, con envíos a todo el país. Escribinos por WhatsApp o a customwear.cba@gmail.com.",
    instagram: "https://www.instagram.com/customwear.cba/",
    tiktok: "https://www.instagram.com/customwear.cba/",
    youtube: "https://www.instagram.com/customwear.cba/",
  },
  sections: {
    categories: { eyebrow: "Explorá", title: "Comprar por categoría", ctaLabel: "Ver todas", ctaHref: "/categorias" },
    featured: { eyebrow: "Selección", title: "Productos destacados", ctaLabel: "Ver todo", ctaHref: "/novedades" },
    collections: { eyebrow: "Colecciones", title: "Cada colección, un universo propio" },
    lookbook: { eyebrow: "Lookbook", title: "Comprá el look completo", ctaLabel: "Ver lookbook", ctaHref: "/lookbook" },
    reviews: { eyebrow: "Opiniones", title: "Lo que dicen nuestros clientes" },
  },
  lookbook: {
    looks: [
      { image: editorial("look-1", 1200, 1500), title: "Look 01 · Urban Tailoring", items: 4 },
      { image: editorial("look-2", 1200, 1500), title: "Look 02 · Off Duty", items: 3 },
      { image: editorial("look-3", 1200, 1500), title: "Look 03 · Layered", items: 5 },
    ],
  },
  homeCollections: [
    { image: editorialWide("col-1"), title: "Urbano", subtitle: "Prendas de todos los días con impronta de calle.", href: "/novedades" },
    { image: editorialWide("col-2"), title: "Oversize", subtitle: "Siluetas amplias y cómodas para tu estilo.", href: "/novedades" },
    { image: editorialWide("col-3"), title: "Accesorios", subtitle: "El detalle que completa el look.", href: "/novedades" },
  ],
  instagram: {
    eyebrow: "Comunidad",
    handle: "@customwear.cba",
    url: "https://www.instagram.com/customwear.cba/",
    images: Array.from({ length: 6 }).map((_, i) => editorial(`instagram-${i}`, 600, 600)),
  },
  reviews: {
    average: reviewStats.average,
    count: reviewStats.count,
    items: defaultReviews.map((r) => ({
      author: r.author,
      rating: r.rating,
      title: r.title,
      body: r.body,
      product: r.product,
      avatar: r.avatar,
    })),
  },
  theme: {
    accent: "#b91c1c",
    ink: "#0a0a0a",
    paper: "#ffffff",
  },
  general: {
    storeName: "CUSTOM WEAR.",
    whatsapp: "5493518086096",
    freeShippingThreshold: 90000,
    transferDiscount: 15,
  },
  coupons: [
    { code: "CUSTOM10", label: "10% de descuento", type: "percent", value: 10 },
    { code: "BIENVENIDO", label: "15% primera compra", type: "percent", value: 15 },
    { code: "ENVIOGRATIS", label: "Envío gratis", type: "fixed", value: 0 },
  ],
  footerColumns: [
    {
      title: "Ayuda",
      links: [
        { label: "Contacto", href: "https://wa.me/5493518086096" },
        { label: "Cómo llegar", href: "https://www.google.com/maps/place/Custom+Wear+Cba/@-31.4267849,-64.1878107,16z" },
        { label: "Cambios y devoluciones", href: "#" },
        { label: "Envíos", href: "#" },
        { label: "Guía de talles", href: "#" },
      ],
    },
    { title: "Empresa", links: ["Sobre Custom Wear", "Venta mayorista", "Trabajá con nosotros", "Novedades"].map((l) => ({ label: l, href: "#" })) },
    { title: "Legales", links: ["Términos y condiciones", "Política de privacidad", "Botón de arrepentimiento", "Defensa al consumidor"].map((l) => ({ label: l, href: "#" })) },
  ],
  payments: ["Visa", "Mastercard", "Amex", "Mercado Pago", "Transferencia"],
  nav: defaultNav as NavItemContent[],
};

/** Combina el contenido guardado con los defaults (por si faltan campos). */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  if (!saved) return DEFAULT_CONTENT;
  return {
    announcement: saved.announcement?.length ? saved.announcement : DEFAULT_CONTENT.announcement,
    hero: { ...DEFAULT_CONTENT.hero, ...saved.hero, slides: saved.hero?.slides?.length ? saved.hero.slides : DEFAULT_CONTENT.hero.slides },
    newCollection: { ...DEFAULT_CONTENT.newCollection, ...saved.newCollection },
    editorial: { ...DEFAULT_CONTENT.editorial, ...saved.editorial },
    newsletter: { ...DEFAULT_CONTENT.newsletter, ...saved.newsletter },
    footer: { ...DEFAULT_CONTENT.footer, ...saved.footer },
    sections: {
      categories: { ...DEFAULT_CONTENT.sections.categories, ...saved.sections?.categories },
      featured: { ...DEFAULT_CONTENT.sections.featured, ...saved.sections?.featured },
      collections: { ...DEFAULT_CONTENT.sections.collections, ...saved.sections?.collections },
      lookbook: { ...DEFAULT_CONTENT.sections.lookbook, ...saved.sections?.lookbook },
      reviews: { ...DEFAULT_CONTENT.sections.reviews, ...saved.sections?.reviews },
    },
    lookbook: { looks: saved.lookbook?.looks?.length ? saved.lookbook.looks : DEFAULT_CONTENT.lookbook.looks },
    homeCollections: saved.homeCollections?.length ? saved.homeCollections : DEFAULT_CONTENT.homeCollections,
    instagram: {
      ...DEFAULT_CONTENT.instagram,
      ...saved.instagram,
      images: saved.instagram?.images?.length ? saved.instagram.images : DEFAULT_CONTENT.instagram.images,
    },
    reviews: {
      average: saved.reviews?.average ?? DEFAULT_CONTENT.reviews.average,
      count: saved.reviews?.count ?? DEFAULT_CONTENT.reviews.count,
      items: saved.reviews?.items?.length ? saved.reviews.items : DEFAULT_CONTENT.reviews.items,
    },
    theme: { ...DEFAULT_CONTENT.theme, ...saved.theme },
    general: { ...DEFAULT_CONTENT.general, ...saved.general },
    coupons: saved.coupons?.length ? saved.coupons : DEFAULT_CONTENT.coupons,
    footerColumns: saved.footerColumns?.length ? saved.footerColumns : DEFAULT_CONTENT.footerColumns,
    payments: saved.payments?.length ? saved.payments : DEFAULT_CONTENT.payments,
    nav: saved.nav?.length ? saved.nav : DEFAULT_CONTENT.nav,
  };
}
