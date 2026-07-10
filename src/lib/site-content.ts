import { editorialWide } from "@/data/images";

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
    slides: { image: string; eyebrow: string }[];
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
}

export const DEFAULT_CONTENT: SiteContent = {
  announcement: [
    "Envío gratis en compras superiores a $90.000",
    "Hasta 6 cuotas sin interés",
    "15% OFF pagando por transferencia",
    "Cambios y devoluciones sin cargo",
  ],
  hero: {
    titleTop: "Diseño que",
    titleBottom: "perdura.",
    ctaPrimaryLabel: "Comprar ahora",
    ctaPrimaryHref: "/novedades",
    ctaSecondaryLabel: "Ver colección",
    ctaSecondaryHref: "/colecciones",
    slides: [
      { image: editorialWide("hero-1", 2000, 1200), eyebrow: "Colección Invierno 26" },
      { image: editorialWide("hero-2", 2000, 1200), eyebrow: "Sastrería contemporánea" },
      { image: editorialWide("hero-3", 2000, 1200), eyebrow: "Essentials" },
    ],
  },
  newCollection: {
    eyebrow: "Nueva colección",
    title: "Invierno 26",
    description:
      "Una temporada construida sobre el abrigo estructurado y la paleta esencial. Prendas pensadas para durar, con tejidos técnicos y naturales seleccionados uno a uno.",
    image: editorialWide("newcol", 1200, 1400),
    ctaLabel: "Descubrir la colección",
    ctaHref: "/coleccion/winter-26",
  },
  editorial: {
    eyebrow: "Filosofía IXXO",
    quote:
      "No seguimos tendencias. Diseñamos prendas que no pasan de moda, con la calidad de lo que se hace bien.",
    subtext:
      "Materiales seleccionados, confección responsable y un compromiso con el detalle que se siente en cada puntada.",
    image: editorialWide("editorial-bg", 2000, 1200),
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: "Sumate al círculo IXXO",
    subtitle: "Acceso anticipado a colecciones, ediciones limitadas y 10% en tu primera compra.",
  },
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
  };
}
