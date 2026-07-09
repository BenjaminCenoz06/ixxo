import type { Collection } from "@/types";
import { editorialWide } from "./images";

export const collections: Collection[] = [
  {
    slug: "essentials",
    title: "Essentials",
    subtitle: "Las bases del guardarropa. Cortes limpios, tejidos nobles.",
    image: editorialWide("col-essentials"),
    align: "left",
  },
  {
    slug: "tailoring",
    title: "Tailoring",
    subtitle: "Sastrería contemporánea para el hombre urbano.",
    image: editorialWide("col-tailoring"),
    align: "right",
  },
  {
    slug: "winter-26",
    title: "Invierno 26",
    subtitle: "Abrigo estructurado en una paleta de grises y negros.",
    image: editorialWide("col-winter"),
    align: "left",
  },
];
