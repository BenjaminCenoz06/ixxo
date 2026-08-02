export interface MegaColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface NavItem {
  label: string;
  href: string;
  mega?: MegaColumn[];
  featured?: { title: string; image: string; href: string };
}

export const navItems: NavItem[] = [
  { label: "Novedades", href: "/novedades" },
  {
    label: "Prendas",
    href: "/prendas",
    mega: [
      {
        heading: "Parte superior",
        links: [
          { label: "Remeras", href: "/categoria/remeras" },
          { label: "Buzos", href: "/categoria/buzos" },
        ],
      },
      {
        heading: "Parte inferior",
        links: [
          { label: "Jeans", href: "/categoria/jeans" },
          { label: "Bermudas", href: "/categoria/bermudas" },
        ],
      },
      {
        heading: "Calzado & accesorios",
        links: [
          { label: "Zapatillas", href: "/categoria/zapatillas" },
          { label: "Accesorios", href: "/categoria/accesorios" },
        ],
      },
    ],
    featured: {
      title: "Nuevos ingresos",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=80&w=600&h=760",
      href: "/novedades",
    },
  },
  // GoodStyle no maneja colecciones ni lookbook: el catálogo se navega por categoría.
  { label: "Zapatillas", href: "/categoria/zapatillas" },
  { label: "Accesorios", href: "/categoria/accesorios" },
];
