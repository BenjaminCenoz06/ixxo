# IXXO — E-commerce premium de moda masculina

Storefront editorial construido con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS v4.

## Desarrollo

```bash
cd ixxo
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 5.9**
- **Tailwind CSS v4** (config CSS-first en `src/app/globals.css` con `@theme`)
- **Framer Motion** — reveals editoriales, hero, micro-interacciones
- **Lenis** — smooth scroll global (se desactiva con `prefers-reduced-motion`)
- **lucide-react** — iconografía (los iconos de marca son SVG propios en `ui/SocialIcons.tsx`)

> Nota: TypeScript queda fijado en la línea 5.x. La 7.x (port nativo) aún rompe el
> type-checker de Next 16.

## Estructura

```
src/
├─ app/                # layout, page (home), globals.css (design system)
├─ components/
│  ├─ layout/          # Header (+ AnnouncementBar, MegaMenu), Footer
│  ├─ home/            # Hero, NewCollection, Categories, FeaturedProducts,
│  │                   # Collections, Editorial, Lookbook, InstagramFeed,
│  │                   # Reviews, Newsletter
│  ├─ product/         # ProductCard
│  └─ ui/              # SmoothScroll, Reveal, Loader, Stars, SectionHeading, SocialIcons
├─ data/               # datos mock tipados (products, categories, collections, reviews, nav)
├─ lib/                # utils (cn), format (precio ARS, transferencia, cuotas)
└─ types/              # interfaces de dominio
```

## Sistema de diseño

Definido con tokens en `globals.css` (`@theme`): paleta monocroma (negro/blanco/grises)
+ un único acento (`--color-accent`) reservado a promociones. Tipografías Inter (texto) y
Manrope (display) vía `next/font`.

## Contenido

Imágenes: placeholders editoriales B&W vía `picsum.photos` (helper en `data/images.ts`).
Reemplazar por Cloudinary / fotos reales de producto en la Fase 4.

## Activar Supabase (Fase 4)

La app funciona con datos mock hasta que conectes Supabase. Para activarlo:

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Copiá `.env.example` a `.env.local` y completá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
3. En el **SQL Editor** de Supabase, ejecutá `supabase/schema.sql` y luego `supabase/seed.sql`.
4. (Opcional) Habilitá el proveedor **Google** en Authentication → Providers, con la redirect URL `http://localhost:3000/auth/callback`.
5. Reiniciá `npm run dev`. Auth, cuenta, favoritos y pedidos pasan a usar la base real automáticamente.

> `npm run seed:gen` regenera `supabase/seed.sql` desde los datos del catálogo.

## Activar Mercado Pago (Fase 5)

Sin credenciales, el checkout muestra una confirmación simulada. Para cobrar de verdad:

1. Obtené las credenciales en el [panel de developers de Mercado Pago](https://www.mercadopago.com.ar/developers/panel).
2. En `.env.local` completá `MERCADOPAGO_ACCESS_TOKEN` y `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`.
3. Configurá `NEXT_PUBLIC_SITE_URL` con tu dominio público (las `back_urls` y el webhook lo usan).
4. En producción, registrá el webhook `https://tu-dominio/api/webhooks/mercadopago` (evento *payment*).

El checkout crea una preferencia (`/api/checkout/mercadopago`) y redirige al pago; al volver,
`/checkout/resultado` muestra aprobado/pendiente/rechazado y el webhook actualiza el estado del
pedido en Supabase. El costo de envío se estima por zona en `src/lib/shipping.ts` (reemplazable
por la cotización real de Mercado Envíos).

## Roadmap

- [x] **Fase 1 — Storefront visual** (home completa, responsive, animaciones)
- [x] **Fase 2 — Catálogo**: PLP + filtros (sidebar/bottom-sheet), búsqueda instantánea, PDP editorial
- [x] **Fase 3 — Carrito & Checkout**: drawer con estado global, cupones, checkout multi-paso (RHF + Zod)
- [x] **Fase 4 — Backend**: Supabase (auth + Google, DB, favoritos, pedidos) con fallback a mock, repositorio de productos, Cloudinary, TanStack Query
- [x] **Fase 5 — Pagos**: Mercado Pago (preferencia + webhook + retorno) y Mercado Envíos (cotización por zona), con fallback a confirmación simulada
- [ ] **Fase 6 — Panel Admin**
- [ ] **Fase 7 — Pulido**: SSR/ISR, SEO, Lighthouse >95, accesibilidad
```
