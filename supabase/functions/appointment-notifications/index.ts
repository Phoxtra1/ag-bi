import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";
import { notificationDue, notificationKey } from "../_shared/appointment-notification-rules.ts";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
type Appointment = {
 id: string; full_name: string; email: string; booking_type: string; duration_minutes: number;
 status: string; payment_status: string; confirmation_email_queued_at: string | null;
 reminder_email_queued_at: string | null;
 appointment_slots: { starts_at: string } | { starts_at: string }[] | null;
};

Deno.serve(async (req) => {
 if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
 if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
 try {
  const input = await req.json();
  const url = Deno.env.get("SUPABASE_URL"), serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "Notification service is unavailable." }, 503);
  if (input.action === "reminders") {
   const authFailure = authenticateCronRequest(req);
   if (authFailure) return authFailure;
  } else if (input.action !== "confirmation") return json({ error: "Unsupported notification action." }, 400);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  async function queue(a: Appointment, kind: "confirmation" | "reminder") {
   const slot = Array.isArray(a.appointment_slots) ? a.appointment_slots[0] : a.appointment_slots;
   if (!slot || !notificationDue(a, slot.starts_at)) return { queued: false, skipped: true };
   const field = kind === "confirmation" ? "confirmation_email_queued_at" : "reminder_email_queued_at";
   if (a[field]) return { queued: true, already_queued: true };
   const dateTime = new Date(slot.starts_at).toLocaleString("en", { dateStyle: "full", timeStyle: "short", timeZone: "UTC" }) + " UTC";
   const { data, error } = await admin.functions.invoke("send-transactional-email", { body: {
    templateName: `appointment-${kind}`, recipientEmail: a.email,
    idempotencyKey: notificationKey(a.id, kind, slot.starts_at),
    templateData: { name: a.full_name, appointmentType: a.booking_type === "consultation" ? "professional consultation" : "request-submission visit", dateTime, durationMinutes: a.duration_minutes, reference: a.id },
   } });
   if (error || data?.error || data?.success === false || data?.suppressed) {
    const message = "Appointment email could not be queued. Verify sender setup and the appointment template registry.";
    const { error: saveError } = await admin.from("appointments").update({ notification_last_error: message, notification_retry_at: new Date(Date.now() + 3600_000).toISOString() }).eq("id", a.id);
    if (saveError) throw saveError;
    return { queued: false, pending_email_setup: true };
   }
   const { error: saveError } = await admin.from("appointments").update({ [field]: new Date().toISOString(), notification_last_error: null, notification_retry_at: null }).eq("id", a.id);
   if (saveError) throw saveError;
   return { queued: true };
  }
  if (input.action === "confirmation") {
   if (!/^[0-9a-f-]{36}$/i.test(String(input.appointment_id || "")) || typeof input.email !== "string") return json({ error: "Invalid booking reference." }, 400);
   // Possession of both the unpredictable booking reference and matching email authorizes
   // only this fixed notification to its stored recipient, never reads or staff actions.
   const { data, error } = await admin.from("appointments").select("*,appointment_slots(starts_at)").eq("id", input.appointment_id).eq("email", input.email.trim().toLowerCase()).single();
   if (error || !data) return json({ error: "Appointment not found." }, 404);
   const a = data as unknown as Appointment;
   if (a.status !== "confirmed" || !["paid", "not_required"].includes(a.payment_status)) return json({ error: "Appointment is not confirmed yet." }, 409);
   if (a.confirmation_email_queued_at) return json({ queued: true, already_queued: true });
   return json(await queue(a, "confirmation"));
  }
  const now = new Date().toISOString();
  const { data, error } = await admin.from("appointments").select("*,appointment_slots!inner(starts_at)")
   .eq("status", "confirmed").in("payment_status", ["paid", "not_required"])
   .is("reminder_email_queued_at", null).gte("appointment_slots.starts_at", now)
   .or(`notification_retry_at.is.null,notification_retry_at.lte.${now}`)
   .order("created_at").limit(100);
  if (error) throw error;
  let queued = 0, pending = 0;
  for (const row of data || []) {
   const a = row as unknown as Appointment;
   const slot = Array.isArray(a.appointment_slots) ? a.appointment_slots[0] : a.appointment_slots;
   if (!slot) continue;
   const kind = notificationDue(a, slot.starts_at);
   if (!kind) continue;
   const result = await queue(a, kind);
   if (result.queued) queued++; else if (result.pending_email_setup) pending++;
  }
  return json({ queued, pending });
 } catch (error) { return json({ error: error instanceof Error ? error.message : "Notification processing failed." }, 500); }
});