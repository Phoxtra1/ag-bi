# Active application rules
- Use the active Cloud-backed application in `src/App.tsx`; legacy Appwrite screens are not the active routing tree, so changes must target the served experience.
- Temporary public admin navigation must not grant public access to customer records or staff mutations; expose aggregate counts only until a verified staff session exists.
- Generate availability server-side in bounded rolling windows, preserving existing slots and atomic capacity checks, so no browser can fabricate bookable inventory.
- Send appointment emails through the shared app-email sender with event-derived idempotency keys; scheduled retries must use managed cron authentication and only mark accepted messages as queued.