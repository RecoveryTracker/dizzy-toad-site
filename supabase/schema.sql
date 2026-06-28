-- Dizzy Toad Woodworks — Supabase schema
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (idempotent).

-- ── Catalog table ───────────────────────────────────────────────────────────
create table if not exists public.pieces (
  id          bigint primary key,
  name        text not null,
  category    text,
  species     text,
  dimensions  text,
  price       numeric not null default 0,
  status      text    not null default 'available',
  photos      jsonb   not null default '[]'::jsonb,   -- array of URLs or repo paths
  description text,
  care        text,
  sort        int     not null default 0,             -- display order
  updated_at  timestamptz not null default now()
);

-- keep updated_at fresh on every write
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists pieces_touch on public.pieces;
create trigger pieces_touch before update on public.pieces
  for each row execute function public.touch_updated_at();

-- ── Row-Level Security: world-readable, admin-only writes ───────────────────
alter table public.pieces enable row level security;

drop policy if exists "pieces public read"   on public.pieces;
drop policy if exists "pieces auth insert"    on public.pieces;
drop policy if exists "pieces auth update"    on public.pieces;
drop policy if exists "pieces auth delete"    on public.pieces;

create policy "pieces public read" on public.pieces
  for select using (true);
create policy "pieces auth insert" on public.pieces
  for insert to authenticated with check (true);
create policy "pieces auth update" on public.pieces
  for update to authenticated using (true) with check (true);
create policy "pieces auth delete" on public.pieces
  for delete to authenticated using (true);

-- ── Photo storage bucket (public read, admin-only upload) ───────────────────
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do nothing;

drop policy if exists "photos public read"  on storage.objects;
drop policy if exists "photos auth write"   on storage.objects;
drop policy if exists "photos auth delete"  on storage.objects;

create policy "photos public read" on storage.objects
  for select using (bucket_id = 'photos');
create policy "photos auth write" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');
create policy "photos auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');
