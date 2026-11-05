-- Migración 003 (Ar_Finance 0.12.0): presupuesto asignado (por categoría y subcategoría) y pagos mensuales del año.
-- Solo AGREGA tablas nuevas; no borra ni cambia tus datos. Ejecutar una sola vez en Supabase > SQL Editor.
-- Antes: Configuración > Respaldo JSON.
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
-- Traslada lo que ya tenías (si existían las tablas de 0.7.0). Las tablas viejas NO se tocan.
do $$ begin
  if to_regclass('public.presupuestos') is not null then
    insert into plan_presupuesto (user_id, categoria, subcategoria, monto)
      select user_id, categoria, null, monto from presupuestos on conflict do nothing;
  end if;
  if to_regclass('public.recurrentes') is not null then
    insert into pagos_anuales (user_id, nombre, categoria, subcategoria, detalle, pagos_anio)
      select r.user_id, r.nombre, r.categoria, r.subcategoria, r.detalle, 12 from recurrentes r
      where not exists (select 1 from pagos_anuales p where p.user_id = r.user_id and p.nombre = r.nombre);
  end if;
end $$;
