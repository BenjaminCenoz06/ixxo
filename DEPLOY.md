# Deploy en Netlify — IXXO

El proyecto está listo para desplegarse en Netlify. `netlify.toml` ya configura el
runtime de Next.js, la versión de Node y las cabeceras. El sitio funciona sin variables
(modo mock); con las variables cargadas usa Supabase y Mercado Pago reales.

## 1. Conectar el repositorio

1. En [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Elegí GitHub y el repo **`BenjaminCenoz06/ixxo`** (branch `main`).
3. Netlify detecta Next.js automáticamente. Confirmá:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** *(vacío — el repo ya es la raíz de la app)*
4. **No hagas deploy todavía**: primero cargá las variables (paso 2).

## 2. Variables de entorno

En **Site configuration → Environment variables**, agregá:

| Variable | Valor | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eughxttjubyiflksywmo.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu `sb_publishable_…` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | tu `sb_secret_…` (rotala antes) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | la URL final, ej. `https://ixxo.netlify.app` | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `benjamincenozmartines@gmail.com` | ✅ |
| `MERCADOPAGO_ACCESS_TOKEN` | tu access token | opcional (pagos) |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | tu public key | opcional (pagos) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | tu cloud name | opcional |

> ⚠️ Nunca subas `.env.local` (ya está en `.gitignore`). Cargá los valores solo en Netlify.

## 3. Deploy

**Deploy site**. El primer build tarda ~2–3 min. Cada `git push` a `main` redeploya solo.

## 4. Post-deploy (una vez que tengas la URL de Netlify)

1. **`NEXT_PUBLIC_SITE_URL`**: si usás un dominio propio, actualizá la variable y redeployá.
2. **Supabase → Authentication → URL Configuration**:
   - *Site URL:* `https://tu-sitio.netlify.app`
   - *Redirect URLs:* agregá `https://tu-sitio.netlify.app/auth/callback`
3. **Google OAuth** (si lo activás): agregá el mismo callback en el proveedor.
4. **Mercado Pago** (si activás pagos): registrá el webhook
   `https://tu-sitio.netlify.app/api/webhooks/mercadopago` (evento *payment*).

## Notas técnicas

- SSR, ISR (revalidación 1h en catálogo), API routes (`/api/*`), `sitemap.xml`, `robots.txt`
  y el middleware (`proxy.ts`) los maneja `@netlify/plugin-nextjs`.
- `next/image` optimiza remotos de Unsplash / Cloudinary / Supabase (ver `next.config.ts`).
- Node fijado en 22 (Next 16 requiere ≥ 20).
