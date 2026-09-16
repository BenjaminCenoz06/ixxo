import "server-only";

/**
 * Etiquetas de caché de los datos del servidor.
 *
 * Las páginas públicas son `force-dynamic` a propósito (commit 8c63a15): se
 * renderizan en cada visita para que un cambio del panel se vea al instante.
 * El problema era que eso hacía que CADA visita le volviera a pedir a Supabase
 * el catálogo entero (159 filas con `select("*")`) y el JSON de contenido de
 * Storage. Eso quemó 11,14 GB de cached egress en un ciclo de facturación
 * contra una cuota de 5 GB, y Supabase restringió el proyecto con HTTP 402.
 *
 * La solución no es volver a HTML estático (perdería la inmediatez del panel),
 * sino cachear la capa de datos: el render sigue siendo dinámico, pero las
 * consultas a Supabase se reutilizan y se invalidan por etiqueta cuando el
 * panel guarda (ver /api/revalidate y /api/admin/revalidate-shop).
 */
export const TAG_CATALOG = "catalog";
export const TAG_CONTENT = "content";

/** Etiquetas que se aceptan desde afuera, para no invalidar cualquier cosa. */
export const REVALIDATABLE_TAGS = [TAG_CATALOG, TAG_CONTENT] as const;

/**
 * Red de seguridad por tiempo. La invalidación por etiqueta es la vía normal;
 * esto sólo cubre el caso de que el aviso del panel se pierda (deploy caído,
 * red, secreto mal cargado) para que la tienda no quede desactualizada.
 */
export const CACHE_TTL_SECONDS = 300;

/**
 * Perfil de expiración para `revalidateTag`.
 *
 * En Next 16 `revalidateTag(tag, profile)` pide un segundo argumento que dice
 * a partir de qué antigüedad se considera vencida una entrada. `expire: 0`
 * purga en el acto, que es lo que hace falta cuando el panel acaba de guardar.
 */
export const PURGAR_YA = { expire: 0 } as const;
