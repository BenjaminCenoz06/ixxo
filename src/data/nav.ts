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
          { label: "Camisas", href: "/categoria/camisas" },
          { label: "Buzos", href: "/categoria/buzos" },
          { label: "Sweaters", href: "/categoria/sweaters" },
        ],
      },
      {
        heading: "Parte inferior",
        links: [
          { label: "Jeans", href: "/categoria/jeans" },
          { label: "Pantalones", href: "/categoria/pantalones" },
          { label: "Joggers", href: "/categoria/joggers" },
          { label: "Bermudas", href: "/categoria/bermudas" },
        ],
      },
      {
        heading: "Abrigo & calzado",
        links: [
          { label: "Camperas", href: "/categoria/camperas" },
          { label: "Zapatillas", href: "/categoria/zapatillas" },
          { label: "Accesorios", href: "/categoria/accesorios" },
          { label: "Ofertas", href: "/categoria/ofertas" },
        ],
      },
    ],
    featured: {
      title: "Invierno 26",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=80&w=600&h=760",
      href: "/coleccion/winter-26",
    },
  },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Lookbook", href: "/lookbook" },
];
