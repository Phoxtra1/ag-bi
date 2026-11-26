-- Keep consultation pricing consistent with the public duration selector.
-- The server is authoritative: 30m=$25, 60m=$50, 90m=$90, 120m=$100.
create or replace function public.create_appointment(
 p_slot_id uuid,p_booking_type text,p_duration_minutes integer,p_full_name text,p_email text,p_phone text,
 p_service_category text,p_request_type text,p_description text,p_additional_information text default null
) returns jsonb language plpgsql security definer set search_path=public
as $$
declare s appointment_slots%rowtype; v_count integer; v_id uuid; v_amount numeric;
begin
 if p_booking_type not in ('request_submission','consultation') then raise exception 'Invalid appointment type.'; end if;
 if p_duration_minutes not in (30,60,90,120) then raise exception 'Invalid consultation duration.'; end if;
 if length(trim(coalesce(p_full_name,'')))<2 or length(trim(coalesce(p_email,'')))<5 or length(trim(coalesce(p_phone,'')))<5 or length(trim(coalesce(p_description,'')))<10 then raise exception 'Complete all required contact and appointment details.'; end if;
 if p_service_category not in ('career_education','business_information','travel_relocation','info_report_verification') then raise exception 'Invalid service area.'; end if;
 select * into s from appointment_slots where id=p_slot_id and published and starts_at>now() for update;
 if not found then raise exception 'This appointment time is no longer available. Please choose another.'; end if;
 if p_duration_minutes > extract(epoch from (s.ends_at-s.starts_at))/60 then raise exception 'The selected time slot is shorter than the consultation duration.'; end if;
 select count(*) into v_count from appointments where slot_id=p_slot_id and status not in ('cancelled','declined');
 if v_count>=s.capacity then raise exception 'This appointment time has just been booked. Please choose another.'; end if;
 v_amount:=case
   when p_booking_type='request_submission' then 0
   when p_duration_minutes=30 then 25
   when p_duration_minutes=60 then 50
   when p_duration_minutes=90 then 90
   when p_duration_minutes=120 then 100
   else 0
 end;
 insert into appointments(slot_id,booking_type,duration_minutes,full_name,email,phone,service_category,request_type,description,additional_information,amount,currency,payment_status,status,user_id)
 values(p_slot_id,p_booking_type,p_duration_minutes,trim(p_full_name),lower(trim(p_email)),trim(p_phone),p_service_category,nullif(trim(p_request_type),''),trim(p_description),nullif(trim(p_additional_information),''),v_amount,'USD',case when v_amount>0 then 'pending' else 'not_required' end,case when v_amount>0 then 'pending' else 'confirmed' end,auth.uid())
 returning id into v_id;
 return jsonb_build_object('appointment_id',v_id,'amount',v_amount,'currency','USD','payment_required',v_amount>0);
end; $$;

grant execute on function public.create_appointment(uuid,text,integer,text,text,text,text,text,text,text) to anon,authenticated;
