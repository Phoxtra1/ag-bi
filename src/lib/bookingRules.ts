export function isTemporaryPublicRoute(pathname: string): boolean {
  return pathname === "/admin";
}

export function localDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function slotFitsDuration(slot: { starts_at: string; ends_at: string; remaining: number }, duration: number, now = Date.now()): boolean {
  return slot.remaining > 0 && new Date(slot.starts_at).getTime() > now &&
    new Date(slot.ends_at).getTime() - new Date(slot.starts_at).getTime() >= duration * 60_000;
}