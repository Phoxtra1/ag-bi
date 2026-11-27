-- Align the appointment notification worker with its persisted queue/retry fields.
alter table public.appointments
  add column if not exists confirmation_email_queued_at timestamptz,
  add column if not exists reminder_email_queued_at timestamptz,
  add column if not exists notification_last_error text,
  add column if not exists notification_retry_at timestamptz,
  add column if not exists provider_message_id text;
create index if not exists appointments_notification_retry_idx
  on public.appointments(notification_retry_at)
  where notification_retry_at is not null;
