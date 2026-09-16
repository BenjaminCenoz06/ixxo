import "server-only";

/**
 * Le avisa a la tienda que sus datos cambiaron.
 *
 * El panel corre en otro sitio de Netlify (admin-good-styles) con su propio
 * caché, así que invalidar acá no alcanza: hay que pegarle al deploy de la
 * tienda. `SHOP_URL` y `REVALIDATE_SECRET` son variables de servidor; el
 * secreto nunca llega al navegador.
 *
 * Si algo falla no se corta la operación del panel: el guardado ya ocurrió y
 * la tienda se refresca sola por TTL en pocos minutos.
 */
export async function notificarTienda(tags: string[]): Promise<boolean> {
  const shop = process.env.SHOP_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!shop || !secret) return false;

  try {
    const res = await fetch(`${shop.replace(/\/+$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
