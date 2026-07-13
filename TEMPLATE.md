# IXXO como base — crear nuevas webs

Este proyecto está pensado como una **base reutilizable**: un e-commerce premium en
Next.js donde **casi todo se edita desde el panel `/admin`** (sin tocar código).
Podés clonarlo para levantar tiendas nuevas en minutos.

## Qué se edita 100% desde el admin (sin código)

- **Diseño:** colores del sitio (acento, principal, fondo)
- **Identidad:** nombre de la tienda, WhatsApp, redes
- **Menú del header:** ítems y mega-menú (columnas + imagen destacada)
- **Home completa:** barra de anuncios, hero, banners, títulos de secciones,
  lookbook, instagram, opiniones, editorial, newsletter
- **Footer:** descripción, redes, columnas de enlaces, medios de pago
- **Catálogo:** productos, categorías, colecciones (CRUD + subir fotos)
- **Comercial:** cupones, envío gratis, % transferencia
- **Operación:** pedidos, clientes, newsletter

> El contenido se guarda como JSON en Supabase Storage y el catálogo en la base;
> los cambios se reflejan en la tienda al instante (páginas dinámicas).

## Cómo crear una web nueva desde esta base

### 1. Copiá el proyecto
Duplicá este repo (fork, template, o copia de la carpeta) con el nombre del nuevo sitio.
Sin backend configurado, el sitio ya funciona con datos de ejemplo (modo mock).

### 2. Nuevo proyecto Supabase
1. Creá un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** → ejecutá, en orden: `supabase/schema.sql`, `supabase/admin.sql`, `supabase/seed.sql`.
   *(No hace falta `content.sql`: el contenido vive en Storage.)*
3. **Storage** → creá un bucket **público** llamado `media`. En sus opciones, permití
   los tipos `image/*` y `application/json` (así se guardan fotos y el contenido del sitio).
4. **Authentication → Providers**: activá Email (y Google si querés login social).

### 3. Nuevo sitio en Netlify
1. **Add new project → Import from GitHub** → elegí el repo.
2. Netlify detecta Next.js solo (build `npm run build`, publish `.next`).
3. Cargá las **variables de entorno** (Project configuration → Environment variables):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable / anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | secret / service role key |
| `NEXT_PUBLIC_SITE_URL` | la URL final del sitio |
| `NEXT_PUBLIC_ADMIN_EMAILS` | tu email de admin (coma para varios) |
| `MERCADOPAGO_ACCESS_TOKEN` *(opcional)* | token de Mercado Pago |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` *(opcional)* | public key de MP |

4. **Deploy**. Cada `git push` redeploya solo.

### 4. Hacete admin y personalizá
1. Registrate en `/cuenta` (confirmá el email).
2. En Supabase SQL Editor:
   `update public.profiles set role='admin' where id=(select id from auth.users where email='TU_EMAIL');`
3. Entrá a `/admin` → **Contenido** y cambiá colores, textos, imágenes, menú, footer,
   catálogo… todo el sitio, sin tocar una línea de código.

## Notas
- **Sin backend, todo funciona con datos mock** — útil para desarrollo o demos.
- El admin puede vivir en el mismo sitio (`/admin`) o como sitio separado usando
  `NEXT_PUBLIC_ADMIN_ONLY=true` (redirige la home a `/admin`).
- Stack: Next.js 16 · React 19 · Tailwind v4 · Supabase · Mercado Pago · Netlify.
