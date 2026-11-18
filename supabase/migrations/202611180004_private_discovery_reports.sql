-- Store complete discovery documents separately from customer-readable previews.
create table if not exists public.discovery_report_private (
  id uuid primary key default gen_random_uuid(),
  discovery_run_id uuid not null unique references public.discovery_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_report jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.discovery_report_private enable row level security;
revoke all on public.discovery_report_private from anon, authenticated;
grant all on public.discovery_report_private to service_role;
