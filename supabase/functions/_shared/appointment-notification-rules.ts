export function notificationDue(appointment: {
  status: string;
  payment_status: string;
  confirmation_email_queued_at?: string | null;
  reminder_email_queued_at?: string | null;
}, startsAt: string, now = Date.now()): "confirmation" | "reminder" | null {
  const start = Date.parse(startsAt);
  if (appointment.status !== "confirmed" || !["paid", "not_required"].includes(appointment.payment_status) || start <= now) return null;
  if (!appointment.confirmation_email_queued_at) return "confirmation";
  if (!appointment.reminder_email_queued_at && start <= now + 24 * 60 * 60 * 1000) return "reminder";
  return null;
}

export function notificationKey(id: string, kind: "confirmation" | "reminder", startsAt: string): string {
  return `appointment-${kind}-${id}-${Date.parse(startsAt)}`;
}