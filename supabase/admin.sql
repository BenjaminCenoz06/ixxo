-- ============================================================
-- IXXO — Roles de admin y políticas de escritura
-- Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase.
-- ============================================================

-- Rol en el perfil (customer | admin)
alter table public.profiles
  add column if not exists role text not null default 'customer';

-- Marcá tu usuario como admin (reemplazá el email):
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'tu@email.com');

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Catálogo: escritura solo para admins ────────────────────
drop policy if exists "productos admin escritura" on public.products;
create policy "productos admin escritura" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categorias admin escritura" on public.categories;
create policy "categorias admin escritura" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "colecciones admin escritura" on public.collections;
create policy "colecciones admin escritura" on public.collections
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Pedidos: admins ven y actualizan todo ───────────────────
drop policy if exists "pedidos admin select" on public.orders;
create policy "pedidos admin select" on public.orders
  for select using (public.is_admin());

drop policy if exists "pedidos admin update" on public.orders;
create policy "pedidos admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "items admin select" on public.order_items;
create policy "items admin select" on public.order_items
  for select using (public.is_admin());
