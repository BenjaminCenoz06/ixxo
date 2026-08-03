/** Tabla de talles compartida por el modal de la ficha y /ayuda/talles. */
export interface SizeRow {
  size: string;
  chest: string;
  waist: string;
  length: string;
}

/** Prendas de arriba: remeras, buzos y chombas. Medidas en centímetros. */
export const TOP_SIZES: SizeRow[] = [
  { size: "XS", chest: "86–90", waist: "72–76", length: "68" },
  { size: "S", chest: "90–96", waist: "76–82", length: "70" },
  { size: "M", chest: "96–102", waist: "82–88", length: "72" },
  { size: "L", chest: "102–108", waist: "88–94", length: "74" },
  { size: "XL", chest: "108–114", waist: "94–100", length: "76" },
  { size: "XXL", chest: "114–120", waist: "100–106", length: "78" },
];

/**
 * Jeans y bermudas se venden por talle numérico argentino. El número es la
 * cintura de la prenda, no la del cuerpo: los cortes baggy quedan holgados.
 */
export const BOTTOM_SIZES: { size: string; waist: string }[] = [
  { size: "38", waist: "76–79" },
  { size: "40", waist: "80–83" },
  { size: "42", waist: "84–87" },
  { size: "44", waist: "88–92" },
  { size: "46", waist: "93–97" },
];
