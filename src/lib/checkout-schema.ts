import { z } from "zod";

export const PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

/** Autocompletado demo de código postal → provincia/ciudad. */
export const CP_LOOKUP: Record<string, { province: string; city: string }> = {
  "1000": { province: "CABA", city: "Ciudad Autónoma de Buenos Aires" },
  "1425": { province: "CABA", city: "Palermo" },
  "1636": { province: "Buenos Aires", city: "Olivos" },
  "5000": { province: "Córdoba", city: "Córdoba Capital" },
  "2000": { province: "Santa Fe", city: "Rosario" },
  "5500": { province: "Mendoza", city: "Mendoza Capital" },
};

export const shippingSchema = z.object({
  firstName: z.string().min(2, "Ingresá tu nombre"),
  lastName: z.string().min(2, "Ingresá tu apellido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono inválido"),
  address: z.string().min(4, "Ingresá tu dirección"),
  apartment: z.string().optional(),
  postalCode: z.string().regex(/^\d{4}$/, "El CP tiene 4 dígitos"),
  province: z.enum(PROVINCES, { message: "Elegí una provincia" }),
  city: z.string().min(2, "Ingresá tu ciudad"),
  notes: z.string().optional(),
});

export type ShippingForm = z.infer<typeof shippingSchema>;
