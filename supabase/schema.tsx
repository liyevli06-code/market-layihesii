-- Supabase > SQL Editor-də bunu bir dəfə işə salın

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

create policy "Hamı oxuya bilər" on public.materials for select using (true);
create policy "Üzv yükləyə bilər" on public.materials for insert to authenticated with check (auth.uid() = user_id);
create policy "Öz materialını silə bilər" on public.materials for delete to authenticated using (auth.uid() = user_id);

create or replace function public.increment_downloads(material_id uuid)
returns void language sql security definer as $$
  update public.materials set downloads = downloads + 1 where id = material_id;
$$;

-- Fayl saxlama (Storage)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do nothing;

create policy "Fayllar açıqdır" on storage.objects for select using (bucket_id = 'materials');
create policy "Üzv fayl yükləyə bilər" on storage.objects for insert to authenticated
  with check (bucket_id = 'materials' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Öz faylını silə bilər" on storage.objects for delete to authenticated
  using (bucket_id = 'materials' and (storage.foldername(name))[1] = auth.uid()::text);
