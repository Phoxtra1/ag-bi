# Information Solutions — Supabase setup

This repository is being repositioned as **Information Solutions by Amineva Global**.

## Runtime configuration

Configure these in Lovable Cloud project settings (do not commit secrets):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The browser uses only the public anon key. Never expose a service-role key, Stripe secret, webhook secret, or AI provider key in Vite variables.

## Supabase usage controls

- Use the database for user profiles, roles, requests, report metadata and payment state—not as a file dump or AI transcript store.
- Keep AI execution, report generation, Stripe Checkout creation and webhook verification in Supabase Edge Functions.
- Store compact structured outputs and report metadata in Postgres. Put larger deliverables in private Storage buckets with short-lived signed URLs.
- Add request quotas and idempotency in Edge Functions before enabling public AI requests.
- Cache reusable public reference material and avoid repeated model calls for identical requests.
- Do not run polling loops from the browser. Use targeted queries, pagination and realtime only where it adds clear value.
- Stripe webhooks are the only authority for marking a payment paid. A browser redirect must never unlock a report.
- Enforce Row Level Security on every user-owned table. Role assignment must be performed by trusted server-side administration only.

## Core service model

1. **Info Discovery** — self-service request, assessment, scoped preview, quoted price, payment, full report delivery.
2. **InfoService** — individually assessed professional engagements: Career and Education; Business Information; Contracts and Commitments; Travel and Relocation; Info and Report Verification.

The AI layer is an internal implementation detail. It must not be presented as a named public product or assistant.

## Migration note

Authentication is being moved to Supabase first. Existing Appwrite-backed legacy content modules are not considered migrated merely because Supabase Auth is configured. Migrate each collection/function deliberately, validate data and permissions, then remove the old integration. Do not delete the legacy Appwrite resources during this transition.
