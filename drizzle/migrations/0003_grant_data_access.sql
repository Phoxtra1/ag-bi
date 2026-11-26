grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update on public.info_discovery_requests to authenticated;
grant select, insert, update on public.infoservice_requests to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.payment_records to authenticated;
grant select, insert, update, delete on public.reports to authenticated;
grant select, insert on public.request_activity to authenticated;
grant select, insert on public.discovery_runs to authenticated;
grant select, insert on public.infoservice_attachments to authenticated;
grant select, insert, update, delete on public.appointment_slots to authenticated;
grant select, update on public.appointments to authenticated;
grant select on public.infoservice_messages to authenticated;

grant all on public.profiles, public.user_roles, public.info_discovery_requests, public.infoservice_requests,
  public.invoices, public.payment_records, public.reports, public.request_activity, public.discovery_runs,
  public.discovery_report_private, public.infoservice_attachments, public.appointment_slots,
  public.appointments, public.infoservice_messages to service_role;
