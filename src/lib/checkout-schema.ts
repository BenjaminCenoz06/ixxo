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

export const SHIPPING_TYPES = ["retiro", "correo", "transporte"] as const;
export type ShippingType = (typeof SHIPPING_TYPES)[number];

export const shippingSchema = z
  .object({
    firstName: z.string().min(2, "Ingresá tu nombre"),
    lastName: z.string().min(2, "Ingresá tu apellido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(6, "Teléfono inválido"),
    // Tipo de envío
    shippingType: z.enum(SHIPPING_TYPES),
    shippingCompany: z.string().optional(),
    // Domicilio (requerido salvo retiro en local)
    address: z.string().optional(),
    apartment: z.string().optional(),
    postalCode: z.string().optional(),
    // Permite "" (el select puede quedar vacío o desmontarse en "retiro").
    province: z.enum(PROVINCES).or(z.literal("")).optional(),
    city: z.string().optional(),
    notes: z.string().optional(),
    // Facturación
    needsInvoice: z.boolean(),
    invoiceName: z.string().optional(),
    invoiceCuit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shippingType !== "retiro") {
      if (!data.address || data.address.trim().length < 4)
        ctx.addIssue({ code: "custom", path: ["address"], message: "Ingresá tu dirección" });
      if (!data.postalCode || !/^\d{4}$/.test(data.postalCode))
        ctx.addIssue({ code: "custom", path: ["postalCode"], message: "El CP tiene 4 dígitos" });
      if (!data.province)
        ctx.addIssue({ code: "custom", path: ["province"], message: "Elegí una provincia" });
      if (!data.city || data.city.trim().length < 2)
        ctx.addIssue({ code: "custom", path: ["city"], message: "Ingresá tu ciudad" });
    }
    if (data.shippingType === "transporte" && (!data.shippingCompany || data.shippingCompany.trim().length < 2))
      ctx.addIssue({ code: "custom", path: ["shippingCompany"], message: "Indicá la empresa de transporte" });
    if (data.needsInvoice) {
      if (!data.invoiceName || data.invoiceName.trim().length < 2)
        ctx.addIssue({ code: "custom", path: ["invoiceName"], message: "Ingresá el nombre o razón social" });
      if (!data.invoiceCuit || !/^\d{2}-?\d{8}-?\d$/.test(data.invoiceCuit.trim()))
        ctx.addIssue({ code: "custom", path: ["invoiceCuit"], message: "CUIT inválido (11 dígitos)" });
    }
  });

export type ShippingForm = z.infer<typeof shippingSchema>;
