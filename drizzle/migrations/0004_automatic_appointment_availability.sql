ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS confirmation_email_queued_at timestamptz;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS reminder_email_queued_at timestamptz;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notification_last_error text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notification_retry_at timestamptz;
CREATE OR REPLACE FUNCTION public.get_public_appointment_slots(p_from timestamptz DEFAULT now(), p_to timestamptz DEFAULT now()+interval '60 days')
RETURNS TABLE(id uuid, starts_at timestamptz, ends_at timestamptz, remaining integer)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_from timestamptz := greatest(coalesce(p_from,now()),now()); v_to timestamptz := least(coalesce(p_to,now()+interval '60 days'),now()+interval '75 days');
BEGIN
 IF v_to <= v_from THEN RETURN; END IF;
 INSERT INTO public.appointment_slots(starts_at,ends_at,capacity,published)
 SELECT t.start_at, t.start_at+interval '2 hours',1,true FROM (
 SELECT (d.day::date+h.hour*interval '1 hour') AT TIME ZONE 'UTC' AS start_at
 FROM generate_series((v_from AT TIME ZONE 'UTC')::date::timestamp,(v_to AT TIME ZONE 'UTC')::date::timestamp,interval '1 day') AS d(day)
 CROSS JOIN (VALUES (9),(11),(13),(15)) AS h(hour)
 ) t WHERE t.start_at >= v_from AND t.start_at < v_to
 ON CONFLICT ON CONSTRAINT appointment_slots_starts_at_ends_at_key DO NOTHING;
 RETURN QUERY SELECT s.id,s.starts_at,s.ends_at,greatest(0,s.capacity-count(a.id)::integer)
 FROM public.appointment_slots s LEFT JOIN public.appointments a ON a.slot_id=s.id AND a.status NOT IN ('cancelled','declined')
 WHERE s.published AND s.starts_at>=v_from AND s.starts_at<v_to
 GROUP BY s.id HAVING s.capacity-count(a.id)::integer>0 ORDER BY s.starts_at;
END; $$;
GRANT EXECUTE ON FUNCTION public.get_public_appointment_slots(timestamptz,timestamptz) TO anon,authenticated;
CREATE OR REPLACE FUNCTION public.get_public_operations_totals()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT jsonb_build_object('appointments',(SELECT count(*) FROM public.appointments),'requests',(SELECT count(*) FROM public.infoservice_requests),'confirmed',(SELECT count(*) FROM public.appointments WHERE status='confirmed'));
$$;
GRANT EXECUTE ON FUNCTION public.get_public_operations_totals() TO anon,authenticated;
NOTIFY pgrst, 'reload schema';