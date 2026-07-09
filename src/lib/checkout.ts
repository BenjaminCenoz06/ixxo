export const FREE_SHIPPING_THRESHOLD = 90000;
export const SHIPPING_COST = 6900;

export interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
}

const COUPONS: Record<string, Coupon> = {
  IXXO10: { code: "IXXO10", label: "10% de descuento", type: "percent", value: 10 },
  BIENVENIDO: { code: "BIENVENIDO", label: "15% primera compra", type: "percent", value: 15 },
  ENVIOGRATIS: { code: "ENVIOGRATIS", label: "Envío gratis", type: "fixed", value: 0 },
};

export function validateCoupon(code: string): Coupon | null {
  return COUPONS[code.trim().toUpperCase()] ?? null;
}

export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon || coupon.type === "fixed") return 0;
  return Math.round((subtotal * coupon.value) / 100);
}

export function shippingCost(subtotal: number, coupon: Coupon | null): number {
  if (coupon?.code === "ENVIOGRATIS") return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  if (subtotal === 0) return 0;
  return SHIPPING_COST;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export function computeTotals(
  subtotal: number,
  coupon: Coupon | null,
  shippingOverride?: number,
): Totals {
  const discount = couponDiscount(coupon, subtotal);
  const shipping = shippingOverride ?? shippingCost(subtotal, coupon);
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount) + shipping,
  };
}
