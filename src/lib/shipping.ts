import { FREE_SHIPPING_THRESHOLD } from "./checkout";
import type { Coupon } from "./checkout";

/**
 * Cotización de envío por zona (aproxima Mercado Envíos).
 * Cuando se integre el token de Mercado Pago, `POST /api/shipping/quote`
 * reemplaza estos valores por la cotización real por CP.
 */
interface Zone {
  cost: number;
  minDays: number;
  maxDays: number;
}

const METRO: Zone = { cost: 4900, minDays: 2, maxDays: 4 };
const CENTRO: Zone = { cost: 6900, minDays: 3, maxDays: 6 };
const INTERIOR: Zone = { cost: 8900, minDays: 4, maxDays: 8 };
const PATAGONIA: Zone = { cost: 11900, minDays: 5, maxDays: 10 };

const ZONE_BY_PROVINCE: Record<string, Zone> = {
  CABA: METRO,
  "Buenos Aires": METRO,
  "Córdoba": CENTRO,
  "Santa Fe": CENTRO,
  "Entre Ríos": CENTRO,
  Mendoza: INTERIOR,
  Tucumán: INTERIOR,
  Salta: INTERIOR,
  Jujuy: INTERIOR,
  "San Juan": INTERIOR,
  "San Luis": INTERIOR,
  "La Rioja": INTERIOR,
  Catamarca: INTERIOR,
  "Santiago del Estero": INTERIOR,
  Corrientes: INTERIOR,
  Misiones: INTERIOR,
  Chaco: INTERIOR,
  Formosa: INTERIOR,
  "La Pampa": CENTRO,
  Neuquén: PATAGONIA,
  "Río Negro": PATAGONIA,
  Chubut: PATAGONIA,
  "Santa Cruz": PATAGONIA,
  "Tierra del Fuego": PATAGONIA,
};

export interface ShippingQuote {
  cost: number;
  minDays: number;
  maxDays: number;
  free: boolean;
}

/** Costos de envío por zona configurables desde el admin. */
export interface ShippingRates {
  metro: number;
  centro: number;
  interior: number;
  patagonia: number;
}

/** Devuelve el costo configurado para la zona de una tarifa base. */
function costFor(zone: Zone, rates?: ShippingRates): number {
  if (!rates) return zone.cost;
  if (zone === METRO) return rates.metro;
  if (zone === INTERIOR) return rates.interior;
  if (zone === PATAGONIA) return rates.patagonia;
  return rates.centro;
}

export function quoteShipping(
  province: string | undefined,
  subtotal: number,
  coupon: Coupon | null,
  threshold = FREE_SHIPPING_THRESHOLD,
  rates?: ShippingRates,
): ShippingQuote {
  const zone = (province && ZONE_BY_PROVINCE[province]) || CENTRO;
  const free =
    coupon?.code === "ENVIOGRATIS" || (subtotal > 0 && subtotal >= threshold);
  return {
    cost: free ? 0 : costFor(zone, rates),
    minDays: zone.minDays,
    maxDays: zone.maxDays,
    free,
  };
}
