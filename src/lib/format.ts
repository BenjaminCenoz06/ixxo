const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Precio de lista, formateado en pesos argentinos. */
export function formatPrice(value: number): string {
  return ARS.format(value);
}

/** Precio con descuento por transferencia (por defecto -15%). */
export function transferPrice(value: number, discount = 0.15): number {
  return Math.round((value * (1 - discount)) / 100) * 100;
}

/** Valor de cada cuota sin interés. */
export function installment(value: number, count = 6): string {
  return ARS.format(Math.round(value / count));
}

/** Porcentaje de descuento entre precio de lista y precio comparado. */
export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
