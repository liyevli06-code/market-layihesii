create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  university text not null,
  faculty text not null,
  subject text not null,
  type text not null check (type in ('qeyd','imtahan','xulase','test')),
  file_path text not null,
  file_name text not null,
  downloads int not null default 0,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.materials enable row level security;

drop policy if exists "materials_select" on public.materials;
drop policy if exists "materials_insert" on public.materials;
drop policy if exists "materials_delete" on public.materials;

create policy "materials_select" on public.materials for select using (true);
create policy "materials_insert" on public.materials for insert to authenticated with check (auth.uid() = user_id);
create policy "materials_delete" on public.materials for delete to authenticated using (auth.uid() = user_id);

create or replace function public.increment_downloads(material_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.materials set downloads = downloads + 1 where id = material_id;
$$;

grant execute on function public.increment_downloads(uuid) to anon, authenticated;
