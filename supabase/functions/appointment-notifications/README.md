# Appointment email scheduling

The `appointment-notifications` Edge Function sends booking confirmations and 24-hour reminders.

## Required Supabase secrets

Set these Edge Function secrets:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

The project already requires `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.

## Schedule reminders

In Supabase Dashboard → Edge Functions → Schedules, schedule `appointment-notifications` every 15 minutes with this JSON body:

```json
{"action":"reminders"}
```

Set the request Authorization header to `Bearer <SUPABASE_SERVICE_ROLE_KEY>` and Content-Type to `application/json`.

The function selects confirmed appointments 23–25 hours ahead, sends one reminder, and records `reminder_email_sent_at` so the same appointment is not reminded twice. The 24-hour window is evaluated in UTC; appointment emails display UTC explicitly.

## Confirmation behaviour

- Free request-submission bookings trigger a confirmation email after the booking is saved.
- Paid consultation bookings trigger confirmation from the Paystack webhook only after Paystack's signed successful-payment event is verified.
- The booking confirmation includes the appointment date/time and appointment UUID reference.
