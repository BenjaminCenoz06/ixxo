import { editorial, editorialWide } from "@/data/images";
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
    /** `items` en 0 esconde el contador; `href` lleva a la categoría. */
    looks: { image: string; title: string; items: number; href?: string }[];
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
    whatsappMessage: string;
    email: string;
    address: string;
    hours: string;
    mapUrl: string;
    freeShippingThreshold: number;
    transferDiscount: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  shipping: {
    metro: number;
    centro: number;
    interior: number;
    patagonia: number;
  };
  bank: {
    banco: string;
    titular: string;
    alias: string;
    cbu: string;
    mpTitular: string;
    mpAlias: string;
  };
  coupons: { code: string; label: string; type: "percent" | "fixed"; value: number }[];
  footerColumns: { title: string; links: { label: string; href: string }[] }[];
  payments: string[];
  nav: NavItemContent[];
}

export const DEFAULT_CONTENT: SiteContent = {
  announcement: [
    "Envíos a todo el país",
    "Envíos a domicilio",
    "Envío gratis a partir de $30.000",
  ],
  hero: {
    titleTop: "Ropa",
    titleBottom: "urbana.",
    ctaPrimaryLabel: "Ver catálogo",
    ctaPrimaryHref: "/novedades",
    ctaSecondaryLabel: "Categorías",
    ctaSecondaryHref: "/prendas",
    slides: [
      { image: editorialWide("hero-1", 2000, 1200), eyebrow: "Indumentaria masculina" },
      { image: editorialWide("hero-2", 2000, 1200), eyebrow: "Calidad + estilo al mejor precio" },
      { image: editorialWide("hero-3", 2000, 1200), eyebrow: "Envíos a todo el país" },
    ],
  },
  newCollection: {
    eyebrow: "Nuevos ingresos",
    title: "Temporada 2026",
    description:
      "Jeans, bermudas, buzos, remeras, zapatillas y accesorios. Ropa urbana masculina con la mejor relación precio-calidad, con envíos a todo el país.",
    // Fuera de las primeras 12, que ya salen como novedades más abajo.
    image: "/productos/p040.jpeg",
    ctaLabel: "Ver los ingresos",
    ctaHref: "/novedades",
  },
  editorial: {
    eyebrow: "Filosofía GoodStyle",
    quote:
      "Ropa urbana con estilo. Calidad y precio, para moverte todos los días por Ituzaingó y donde vayas.",
    subtext:
      "Indumentaria masculina en Ituzaingó, Corrientes. Atención cercana en el local de Mariano Moreno y envíos a todo el país.",
    image: editorialWide("editorial-bg", 2000, 1200),
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: "Sumate a la comunidad GoodStyle",
    subtitle: "Enterate primero de los nuevos ingresos y las promos de la semana.",
  },
  footer: {
    description:
      "Indumentaria masculina en Ituzaingó, Corrientes. Ropa urbana: calidad y estilo al mejor precio, con envíos a todo el país. Escribinos por WhatsApp o pasá por el local.",
    instagram: "https://www.instagram.com/good.style.ok/",
    tiktok: "https://www.instagram.com/good.style.ok/",
    youtube: "https://www.instagram.com/good.style.ok/",
  },
  sections: {
    categories: { eyebrow: "Explorá", title: "Comprar por categoría", ctaLabel: "Ver todas", ctaHref: "/categorias" },
    featured: { eyebrow: "Selección", title: "Productos destacados", ctaLabel: "Ver todo", ctaHref: "/novedades" },
    collections: { eyebrow: "Categorías", title: "Elegí por dónde empezar" },
    lookbook: { eyebrow: "El local", title: "Mirá lo que hay", ctaLabel: "Ver todo el catálogo", ctaHref: "/prendas" },
    reviews: { eyebrow: "Opiniones", title: "Lo que dicen nuestros clientes" },
  },
  // GoodStyle no produce "looks": son atajos a categorías con foto real del
  // local. Sin contador inventado y cada uno linkea a donde dice que va.
  lookbook: {
    looks: [
      { image: "/productos/p020.jpeg", title: "Jeans", items: 0, href: "/categoria/jeans" },
      { image: "/productos/p070.jpeg", title: "Buzos", items: 0, href: "/categoria/buzos" },
      { image: "/productos/p100.jpeg", title: "Remeras", items: 0, href: "/categoria/remeras" },
    ],
  },
  homeCollections: [
    { image: editorialWide("col-1"), title: "Jeans y bermudas", subtitle: "Baggy, semi baggy, mom y joggers.", href: "/categoria/jeans" },
    { image: editorialWide("col-2"), title: "Buzos y remeras", subtitle: "Oversize, boxy y clásicos.", href: "/categoria/buzos" },
    { image: editorialWide("col-3"), title: "Accesorios", subtitle: "Gorras, relojes, perfumes y más.", href: "/categoria/accesorios" },
  ],
  instagram: {
    eyebrow: "Comunidad",
    handle: "@good.style.ok",
    url: "https://www.instagram.com/good.style.ok/",
    // Fotos reales del local: presentar fotos de banco como posts de
    // @good.style.ok sería hacer pasar ropa ajena por la del negocio.
    images: ["p010", "p030", "p060", "p095", "p120", "p150"].map((id) => `/productos/${id}.jpeg`),
  },
  reviews: {
    average: 5,
    count: 1,
    items: [
      {
        author: "Dylan thomas Galeano",
        rating: 5,
        title: "",
        body: "",
        product: "",
        avatar: "",
      },
    ],
  },
  theme: {
    accent: "#f5b301",
    ink: "#ffffff",
    paper: "#14532d",
  },
  general: {
    storeName: "GOODSTYLE.",
    whatsapp: "5493786411223",
    whatsappMessage: "¡Hola GoodStyle! Quiero hacer una consulta.",
    email: "",
    address: "Mariano Moreno, W3407 Ituzaingó, Corrientes",
    hours: "Abre a las 9:30 h",
    mapUrl:
      "https://www.google.com/maps/place/GoodStyle/@-27.590084,-56.6966917,17z/data=!3m1!4b1!4m6!3m5!1s0x94573901b5e70ba9:0x84e1114f88de1a05!8m2!3d-27.5900888!4d-56.6941168!16s%2Fg%2F11yhdvyvhq",
    freeShippingThreshold: 30000,
    transferDiscount: 0,
  },
  seo: {
    title: "GoodStyle — Indumentaria masculina en Ituzaingó, Corrientes",
    description:
      "GoodStyle. Ropa urbana masculina en Ituzaingó, Corrientes: jeans, bermudas, buzos, remeras, zapatillas y accesorios. Calidad y estilo al mejor precio, con envíos a todo el país.",
    keywords:
      "ropa urbana, indumentaria masculina, ropa hombre Ituzaingó, jeans baggy, buzos oversize, GoodStyle, Corrientes",
  },
  shipping: {
    metro: 4900,
    centro: 6900,
    interior: 8900,
    patagonia: 11900,
  },
  bank: {
    banco: "",
    titular: "GoodStyle",
    alias: "",
    cbu: "",
    mpTitular: "",
    mpAlias: "",
  },
  coupons: [
    { code: "GOOD10", label: "10% de descuento", type: "percent", value: 10 },
    { code: "BIENVENIDO", label: "15% primera compra", type: "percent", value: 15 },
    { code: "ENVIOGRATIS", label: "Envío gratis", type: "fixed", value: 0 },
  ],
  footerColumns: [
    {
      title: "Ayuda",
      links: [
        { label: "Contacto", href: "https://wa.me/5493786411223" },
        {
          label: "Cómo llegar",
          href: "https://www.google.com/maps/place/GoodStyle/@-27.590084,-56.6966917,17z",
        },
        { label: "Retiro en el local", href: "#" },
        { label: "Envíos", href: "#" },
        { label: "Guía de talles", href: "#" },
      ],
    },
    {
      title: "GoodStyle",
      links: [
        { label: "Nuevos ingresos", href: "/novedades" },
        { label: "Ver todo el catálogo", href: "/prendas" },
        { label: "Instagram", href: "https://www.instagram.com/good.style.ok/" },
        {
          label: "Local en Ituzaingó",
          href: "https://www.google.com/maps/place/GoodStyle/@-27.590084,-56.6966917,17z",
        },
      ],
    },
    { title: "Legales", links: ["Términos y condiciones", "Política de privacidad", "Botón de arrepentimiento", "Defensa al consumidor"].map((l) => ({ label: l, href: "#" })) },
  ],
  // Solo lo que el local realmente cobra hoy. Al activar Mercado Pago se
  // agregan las tarjetas desde /admin/contenido.
  payments: ["Mercado Pago", "Transferencia", "Efectivo en el local"],
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
    seo: { ...DEFAULT_CONTENT.seo, ...saved.seo },
    shipping: { ...DEFAULT_CONTENT.shipping, ...saved.shipping },
    bank: { ...DEFAULT_CONTENT.bank, ...saved.bank },
    coupons: saved.coupons?.length ? saved.coupons : DEFAULT_CONTENT.coupons,
    footerColumns: saved.footerColumns?.length ? saved.footerColumns : DEFAULT_CONTENT.footerColumns,
    payments: saved.payments?.length ? saved.payments : DEFAULT_CONTENT.payments,
    nav: saved.nav?.length ? saved.nav : DEFAULT_CONTENT.nav,
  };
}
