const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/**
 * Devuelve una URL de Cloudinary optimizada para un public_id.
 * Si Cloudinary no está configurado, devuelve el valor tal cual
 * (permite seguir usando URLs de placeholder).
 */
export function cloudinaryUrl(
  idOrUrl: string,
  opts: { width?: number; height?: number } = {},
): string {
  if (!CLOUD_NAME || idOrUrl.startsWith("http")) return idOrUrl;
  const t = ["f_auto", "q_auto"];
  if (opts.width) t.push(`w_${opts.width}`);
  if (opts.height) t.push(`h_${opts.height}`, "c_fill");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t.join(",")}/${idOrUrl}`;
}
