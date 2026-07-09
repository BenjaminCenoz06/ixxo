import type { Review } from "@/types";

const AVATAR_MAP: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  "2": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "3": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
  "4": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "5": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "6": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
};

const avatar = (seed: string) => {
  const base = AVATAR_MAP[seed];
  if (base) return `${base}?auto=format&fit=crop&q=80&w=120&h=120`;
  return `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120`;
};

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Martín L.",
    rating: 5,
    title: "Calidad superior",
    body: "La tela es notablemente más pesada que otras marcas. El calce oversize es perfecto y la terminación impecable.",
    date: "12 Jun 2026",
    verified: true,
    product: "Remera Oversize Heavyweight",
    avatar: avatar("1"),
  },
  {
    id: "r2",
    author: "Federico R.",
    rating: 5,
    title: "Se siente premium",
    body: "Llegó en 48hs, empaque cuidadísimo. La camisa de lino es exactamente como en las fotos. Vuelvo a comprar seguro.",
    date: "3 Jun 2026",
    verified: true,
    product: "Camisa de Lino Relaxed",
    avatar: avatar("2"),
  },
  {
    id: "r3",
    author: "Nicolás D.",
    rating: 5,
    title: "Mi campera favorita",
    body: "Estructura, peso y detalles de otro nivel. Recibo cumplidos cada vez que la uso.",
    date: "28 May 2026",
    verified: true,
    product: "Campera Bomber Tech",
    avatar: avatar("3"),
  },
  {
    id: "r4",
    author: "Tomás G.",
    rating: 4,
    title: "Muy buen jean",
    body: "El selvedge es real y la caída excelente. Le doy 4 solo porque tardé en encontrar mi talle.",
    date: "19 May 2026",
    verified: true,
    product: "Jean Slim Raw Selvedge",
    avatar: avatar("4"),
  },
  {
    id: "r5",
    author: "Joaquín P.",
    rating: 5,
    title: "Abriga y viste",
    body: "El sweater de merino es suave, no pica y mantiene la forma. Diseño sobrio, ideal para todos los días.",
    date: "11 May 2026",
    verified: true,
    product: "Sweater Lana Merino",
    avatar: avatar("5"),
  },
  {
    id: "r6",
    author: "Lucas M.",
    rating: 5,
    title: "Zapatillas atemporales",
    body: "Cuero real, minimalistas, combinan con todo. Cómodas desde el primer día.",
    date: "2 May 2026",
    verified: true,
    product: "Zapatillas Leather Minimal",
    avatar: avatar("6"),
  },
];

export const reviewStats = {
  average: 4.9,
  count: 1284,
  distribution: [
    { stars: 5, pct: 91 },
    { stars: 4, pct: 7 },
    { stars: 3, pct: 1 },
    { stars: 2, pct: 0.5 },
    { stars: 1, pct: 0.5 },
  ],
};
