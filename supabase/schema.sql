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
