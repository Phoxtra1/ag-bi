-- Sensitive Info discovery mode and global USD invoice/report defaults.
alter table public.discovery_runs
  add column if not exists discovery_mode text not null default 'general';

alter table public.discovery_runs
  drop constraint if exists discovery_runs_discovery_mode_check;

alter table public.discovery_runs
  add constraint discovery_runs_discovery_mode_check
  check (discovery_mode in ('general', 'sensitive'));

alter table public.discovery_runs alter column currency set default 'USD';
alter table public.invoices alter column currency set default 'USD';
alter table public.infoservice_requests alter column currency set default 'USD';
