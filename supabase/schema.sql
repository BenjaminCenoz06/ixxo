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
