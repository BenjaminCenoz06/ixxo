/**
 * Config de Mercado Pago.
 * `isMercadoPagoConfigured` permite que el checkout degrade a una
 * confirmación simulada cuando todavía no se cargó el access token.
 */
export const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "";

/** Solo servidor: hay access token. */
export const isMercadoPagoConfigured = MP_ACCESS_TOKEN.length > 0;

/** Cliente: hay public key (para saber si mostrar el flujo real). */
export const isMercadoPagoPublicConfigured = MP_PUBLIC_KEY.length > 0;
