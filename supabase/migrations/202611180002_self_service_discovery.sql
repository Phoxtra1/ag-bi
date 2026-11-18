-- Self-service Info Discovery runs and pay-as-you-go report access.
create table if not exists public.discovery_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  context text,
  title text,
  preview jsonb not null default '{}'::jsonb,
  full_report jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  price numeric(12,2),
  currency text not null default 'GHS',
  payment_status text not null default 'preview' check (payment_status in ('preview','pending','paid','failed')),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists discovery_runs_user_created_idx on public.discovery_runs(user_id,created_at desc);
alter table public.discovery_runs enable row level security;
drop policy if exists "Customers read own discovery runs" on public.discovery_runs;
create policy "Customers read own discovery runs" on public.discovery_runs for select to authenticated using (user_id=auth.uid());
drop policy if exists "Customers create own discovery runs" on public.discovery_runs;
create policy "Customers create own discovery runs" on public.discovery_runs for insert to authenticated with check (user_id=auth.uid());
drop policy if exists "Staff read discovery runs" on public.discovery_runs;
create policy "Staff read discovery runs" on public.discovery_runs for select to authenticated using (public.has_staff_role());
alter table public.invoices add column if not exists discovery_run_id uuid references public.discovery_runs(id) on delete set null;
alter table public.reports add column if not exists discovery_run_id uuid references public.discovery_runs(id) on delete set null;
