-- ============================================================
-- IXXO — Contenido editable del sitio (CMS)
-- Ejecutar en Supabase → SQL Editor DESPUÉS de schema.sql + admin.sql
-- ============================================================

create table if not exists public.site_content (
  id         text primary key,
  content    jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Lectura pública (la tienda lee el contenido)
drop policy if exists "contenido lectura publica" on public.site_content;
create policy "contenido lectura publica" on public.site_content
  for select using (true);

-- Escritura solo para admins (usa is_admin() de admin.sql)
drop policy if exists "contenido admin escritura" on public.site_content;
create policy "contenido admin escritura" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- Fila inicial (el sitio usa los defaults del código mientras esté vacía)
insert into public.site_content (id, content) values ('home', '{}')
on conflict (id) do nothing;
