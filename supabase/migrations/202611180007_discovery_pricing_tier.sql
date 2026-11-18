-- Persist the report classification chosen from the completed research.
alter table public.discovery_runs
  add column if not exists pricing_tier text;

alter table public.discovery_runs
  drop constraint if exists discovery_runs_pricing_tier_check;

alter table public.discovery_runs
  add constraint discovery_runs_pricing_tier_check
  check (pricing_tier is null or pricing_tier in ('Quick Discovery', 'Insight Report', 'Deep Research', 'Sensitive Info'));
