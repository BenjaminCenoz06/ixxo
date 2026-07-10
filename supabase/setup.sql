-- ============================================================
-- IXXO — SETUP COMPLETO (schema + admin + seed)
-- Pegá TODO este archivo en Supabase → SQL Editor → Run
-- ============================================================

-- ============================================================
-- IXXO — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Catálogo ────────────────────────────────────────────────
create table if not exists public.categories (
  id    uuid primary key default gen_random_uuid(),
  slug  text unique not null,
  name  text not null,
  image text,
  sort  int default 0
);

create table if not exists public.collections (
  id       uuid primary key default gen_random_uuid(),
  slug     text unique not null,
  title    text not null,
  subtitle text,
  image    text
);

create table if not exists public.products (
  id               text primary key,
  slug             text unique not null,
  name             text not null,
  category_slug    text not null references public.categories(slug),
  price            int not null,
  compare_at_price int,
  images           text[] not null default '{}',
  colors           text[] not null default '{}',
  sizes            text[] not null default '{}',
  stock            int not null default 0,
  is_new           boolean not null default false,
  collection       text,
  rating           numeric(2,1) not null default 5,
  review_count     int not null default 0,
  description      text,
  materials        text[],
  care             text[],
  created_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_slug);

-- ── Usuarios ────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text not null,
  address     text not null,
  apartment   text,
  postal_code text not null,
  province    text not null,
  city        text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ── Pedidos ─────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  number           text unique not null,
  user_id          uuid references auth.users(id) on delete set null,
  email            text not null,
  status           text not null default 'pending',
  subtotal         int not null,
  discount         int not null default 0,
  shipping         int not null default 0,
  total            int not null,
  coupon           text,
  shipping_address jsonb not null default '{}',
  created_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  name       text not null,
  image      text,
  color      text not null,
  size       text not null,
  qty        int not null,
  price      int not null
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.categories  enable row level security;
alter table public.collections enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.addresses   enable row level security;
alter table public.favorites   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Catálogo: lectura pública
create policy "catalogo lectura publica" on public.categories  for select using (true);
create policy "coleccion lectura publica" on public.collections for select using (true);
create policy "productos lectura publica" on public.products    for select using (true);

-- Perfiles: cada usuario ve/edita el suyo
create policy "perfil propio - select" on public.profiles for select using (auth.uid() = id);
create policy "perfil propio - update" on public.profiles for update using (auth.uid() = id);
create policy "perfil propio - insert" on public.profiles for insert with check (auth.uid() = id);

-- Direcciones: dueño
create policy "direcciones propias" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Favoritos: dueño
create policy "favoritos propios" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Pedidos: dueño (o invitado sin user_id, gestionado por backend con service role)
create policy "pedidos propios - select" on public.orders for select using (auth.uid() = user_id);
create policy "pedidos propios - insert" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "items de pedidos propios" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ============================================================
-- Trigger: crear perfil automáticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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

-- Generado por scripts/generate-seed.mjs — NO editar a mano.

insert into public.categories (slug, name, sort) values
  ('remeras', 'Remeras', 0),
  ('camisas', 'Camisas', 1),
  ('buzos', 'Buzos', 2),
  ('camperas', 'Camperas', 3),
  ('jeans', 'Jeans', 4),
  ('pantalones', 'Pantalones', 5),
  ('joggers', 'Joggers', 6),
  ('sweaters', 'Sweaters', 7),
  ('bermudas', 'Bermudas', 8),
  ('zapatillas', 'Zapatillas', 9),
  ('accesorios', 'Accesorios', 10)
on conflict (slug) do nothing;

insert into public.collections (slug, title, subtitle, image) values
  ('essentials', 'Essentials', 'Las bases del guardarropa. Cortes limpios, tejidos nobles.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1600&h=900'),
  ('tailoring', 'Tailoring', 'Sastrería contemporánea para el hombre urbano.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600&h=900'),
  ('winter-26', 'Invierno 26', 'Abrigo estructurado en una paleta de grises y negros.', 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1600&h=900')
on conflict (slug) do nothing;

insert into public.products
  (id, slug, name, category_slug, price, compare_at_price, images, colors, sizes, stock, is_new, collection, rating, review_count, description, materials, care)
values
  ('p01', 'remera-oversize-heavyweight', 'Remera Oversize Heavyweight', 'remeras', 32900, null, array['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Blanco', 'Gris']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 42, true, 'Essentials', 4.5, 12, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['100% algodón peinado 240g']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p02', 'remera-box-fit-pima', 'Remera Box Fit Pima', 'remeras', 28900, null, array['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Blanco', 'Arena', 'Azul']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 60, false, 'Essentials', 4.6, 19, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p03', 'remera-manga-larga-rib', 'Remera Manga Larga Rib', 'remeras', 36900, null, array['https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1618354691438-25bc04584c24?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Gris oscuro']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 24, true, null, 4.7, 26, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p04', 'camisa-de-lino-relaxed', 'Camisa de Lino Relaxed', 'camisas', 58900, 74900, array['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Blanco', 'Negro', 'Arena']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 3, false, 'Essentials', 4.8, 33, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['100% lino']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p05', 'camisa-overshirt-franela', 'Camisa Overshirt Franela', 'camisas', 69900, null, array['https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Verde', 'Marrón', 'Gris oscuro']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 18, false, 'Winter 26', 4.9, 40, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p06', 'camisa-oxford-slim', 'Camisa Oxford Slim', 'camisas', 52900, null, array['https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Blanco', 'Azul']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 30, false, null, 4.5, 47, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p07', 'hoodie-brushed-fleece', 'Hoodie Brushed Fleece', 'buzos', 64900, 84900, array['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Gris', 'Negro', 'Blanco']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 55, false, 'Essentials', 4.6, 54, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Algodón/poliéster 400g brushed']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p08', 'buzo-crewneck-boxy', 'Buzo Crewneck Boxy', 'buzos', 59900, null, array['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Arena', 'Negro', 'Verde']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 22, true, null, 4.7, 61, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p09', 'campera-bomber-tech', 'Campera Bomber Tech', 'camperas', 129900, null, array['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Gris oscuro']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 17, true, 'Winter 26', 4.8, 68, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Nylon técnico impermeable', 'Forro acolchado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p10', 'parka-acolchada-larga', 'Parka Acolchada Larga', 'camperas', 189900, 219900, array['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Verde']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 8, false, 'Winter 26', 4.9, 75, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p11', 'campera-de-cuero-minimal', 'Campera de Cuero Minimal', 'camperas', 249900, null, array['https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Marrón']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 5, false, 'Tailoring', 4.5, 82, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Cuero vacuno full grain']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p12', 'jean-slim-raw-selvedge', 'Jean Slim Raw Selvedge', 'jeans', 74900, null, array['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Gris oscuro', 'Azul']::text[], array['28', '30', '32', '34', '36']::text[], 28, false, 'Essentials', 4.6, 89, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Denim selvedge 13.5oz']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p13', 'jean-straight-washed', 'Jean Straight Washed', 'jeans', 69900, 89900, array['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Azul', 'Negro']::text[], array['28', '30', '32', '34', '36']::text[], 34, false, null, 4.7, 96, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p14', 'pantalon-sastrero-pleated', 'Pantalón Sastrero Pleated', 'pantalones', 79900, null, array['https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Gris oscuro', 'Arena']::text[], array['28', '30', '32', '34', '36']::text[], 19, false, 'Tailoring', 4.8, 103, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Lana fría stretch']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p15', 'pantalon-chino-tapered', 'Pantalón Chino Tapered', 'pantalones', 62900, null, array['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Arena', 'Verde', 'Negro']::text[], array['28', '30', '32', '34', '36']::text[], 40, false, null, 4.9, 110, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p16', 'jogger-tech-conico', 'Jogger Tech Cónico', 'joggers', 57900, null, array['https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Gris']::text[], array['28', '30', '32', '34', '36']::text[], 33, true, null, 4.5, 117, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p17', 'sweater-lana-merino', 'Sweater Lana Merino', 'sweaters', 89900, null, array['https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Gris oscuro', 'Camel', 'Negro']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 2, true, 'Tailoring', 4.6, 124, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['100% lana merino']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p18', 'sweater-half-zip-cable', 'Sweater Half-Zip Cable', 'sweaters', 84900, null, array['https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1608063615781-e2ef8c13d114?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Arena', 'Verde']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 14, false, 'Winter 26', 4.7, 131, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p19', 'cardigan-punto-grueso', 'Cardigan Punto Grueso', 'sweaters', 96900, 119900, array['https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1620799137054-d6219b4e5421?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Marrón', 'Gris']::text[], array['XS', 'S', 'M', 'L', 'XL', 'XXL']::text[], 9, false, null, 4.8, 18, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p20', 'bermuda-cargo-ripstop', 'Bermuda Cargo Ripstop', 'bermudas', 46900, null, array['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Arena', 'Verde', 'Negro']::text[], array['28', '30', '32', '34', '36']::text[], 26, false, null, 4.9, 25, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p21', 'zapatillas-leather-minimal', 'Zapatillas Leather Minimal', 'zapatillas', 119900, 149900, array['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Blanco', 'Negro']::text[], array['39', '40', '41', '42', '43', '44']::text[], 11, false, 'Essentials', 4.5, 32, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Cuero premium', 'Suela de goma']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p22', 'zapatillas-runner-knit', 'Zapatillas Runner Knit', 'zapatillas', 109900, null, array['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Gris']::text[], array['39', '40', '41', '42', '43', '44']::text[], 20, true, null, 4.6, 39, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p23', 'gorra-structured-wool', 'Gorra Structured Wool', 'accesorios', 24900, null, array['https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Camel', 'Gris oscuro']::text[], array['Único']::text[], 50, false, null, 4.7, 46, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Tejido premium seleccionado']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[]),
  ('p24', 'cinturon-cuero-italiano', 'Cinturón Cuero Italiano', 'accesorios', 34900, null, array['https://images.unsplash.com/photo-1624222247344-550fb8ec5521?auto=format&fit=crop&q=80&w=900&h=1200', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=900&h=1200']::text[], array['Negro', 'Marrón']::text[], array['Único']::text[], 38, false, 'Tailoring', 4.8, 53, 'Una prenda esencial de la línea IXXO. Corte cuidado, caída impecable y terminaciones pensadas para durar.', array['Cuero italiano', 'Hebilla mate']::text[], array['Lavar a máquina en frío', 'No usar lavandina', 'Planchar a temperatura media', 'No secar en secadora']::text[])
on conflict (id) do nothing;
