create table movimientos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('ingreso','gasto')),
  monto numeric(12,2) not null check (monto > 0),
  fecha date not null,
  categoria text not null,
  subcategoria text,
  detalle text,
  descripcion text,
  cantidad numeric(12,2) check (cantidad is null or cantidad > 0),
  creado_en timestamptz not null default now()
);
create table categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  subs jsonb not null default '[]',
  unique (user_id, nombre)
);
create table notas (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  texto text not null default '',
  actualizado_en timestamptz not null default now()
);
alter table movimientos enable row level security;
alter table categorias enable row level security;
alter table notas enable row level security;
create policy "movimientos propios" on movimientos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categorias propias" on categorias for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas propias" on notas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on movimientos (user_id, fecha desc);
-- Máximo 3 categorías propias por usuario (también se valida en la app)
create function limite_categorias() returns trigger language plpgsql as $$
begin
  if (select count(*) from categorias where user_id = new.user_id) >= 3 then
    raise exception 'Máximo 3 categorías propias';
  end if;
  return new;
end $$;
create trigger t_limite_categorias before insert on categorias for each row execute function limite_categorias();

-- 0.7.0: presupuestos y pagos recurrentes (ver supabase/migrations/001_presupuestos_recurrentes.sql)
create table if not exists presupuestos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  categoria text not null,
  monto numeric(12,2) not null check (monto > 0),
  unique (user_id, categoria)
);
create table if not exists recurrentes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  categoria text not null,
  subcategoria text,
  detalle text,
  monto numeric(12,2) not null check (monto > 0),
  dia int not null check (dia between 1 and 31),
  creado_en timestamptz not null default now()
);
alter table presupuestos enable row level security;
alter table recurrentes enable row level security;
drop policy if exists "presupuestos propios" on presupuestos;
drop policy if exists "recurrentes propios" on recurrentes;
create policy "presupuestos propios" on presupuestos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recurrentes propios" on recurrentes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists recurrentes_user on recurrentes (user_id);

-- 0.7.0: metas de ahorro (ver supabase/migrations/002_metas_ahorro.sql)
create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  objetivo numeric(12,2) not null check (objetivo > 0),
  ahorrado numeric(12,2) not null default 0 check (ahorrado >= 0),
  fecha_limite date,
  creado_en timestamptz not null default now()
);
alter table metas enable row level security;
drop policy if exists "metas propias" on metas;
create policy "metas propias" on metas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists metas_user on metas (user_id);

-- 0.12.0: presupuesto asignado y pagos mensuales (ver supabase/migrations/003_pagos_presupuesto.sql)
create table if not exists plan_presupuesto (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  categoria text not null,
  subcategoria text,
  monto numeric(12,2) not null check (monto > 0),
  creado_en timestamptz not null default now()
);
create unique index if not exists plan_presupuesto_unico on plan_presupuesto (user_id, categoria, coalesce(subcategoria, ''));
create table if not exists pagos_anuales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  categoria text not null,
  subcategoria text,
  detalle text,
  pagos_anio int not null default 12 check (pagos_anio between 1 and 12),
  creado_en timestamptz not null default now()
);
alter table plan_presupuesto enable row level security;
alter table pagos_anuales enable row level security;
drop policy if exists "plan propio" on plan_presupuesto;
drop policy if exists "pagos propios" on pagos_anuales;
create policy "plan propio" on plan_presupuesto for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pagos propios" on pagos_anuales for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists pagos_anuales_user on pagos_anuales (user_id);
