# Info Solutions by Amineva Global

A focused information services platform with two service areas:

- **Info Discovery** — a self-service research workspace. Customers enter a question, receive an initial review, then pay as they go to unlock the complete report.
- **InfoService** — individually scoped professional information services across Career and Education, Business Information, Contracts and Commitments, Travel and Relocation, and Info and Report Verification.

## Product architecture

- React + TypeScript + Vite frontend.
- Supabase Auth for customer accounts.
- Supabase Postgres with Row Level Security for requests, assessments, invoices, payments and reports.
- Private Supabase Storage bucket for report files.
- Separate staff workflow for InfoService engagements, including assessment, appointments/discussion, quotations, invoicing and delivery.
- No monthly subscription requirement.

The current build is intentionally independent of the previous ABI/Business Intelligence application. Legacy source modules are not imported by the new application entry point.

## Supabase setup

1. Create or select the dedicated Supabase project.
2. Run the migrations in order: `202611180001_information_solutions.sql`, `202611180002_self_service_discovery.sql`, and `202611180003_protect_paid_discovery_reports.sql`.
3. Configure Authentication > URL Configuration with the deployed platform URL and the local development URL if needed.
4. Enable email confirmation if required by your account policy.
5. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Set the same public environment values in Lovable Cloud / deployment environment.
7. Register the first staff account, then grant the administrator role in the Supabase SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id, role) do nothing;
```

Do not put the Supabase service-role key in a `VITE_*` variable or browser code.

## Local development

```sh
npm install
cp .env.example .env
npm run dev
```

## Operational workflow

### Info Discovery
Customer enters a question → the server-side research engine discovers, verifies, analyzes and connects information → a structured review is shown → customer chooses whether to pay to unlock the complete report. Product recommendations are surfaced when the topic matches an Amineva product.

### InfoService
Customer submits a professional service request → staff assesses and discusses scope → quotation and invoice are issued → payment is confirmed → work is delivered and report/record is released as appropriate.

The staff console handles InfoService only. Info Discovery uses a server-side Edge Function and a pay-as-you-go unlock contract. Connect the payment provider and require signed webhook confirmation; never mark a payment paid based solely on a browser redirect.

## Info Discovery engine configuration

Deploy `supabase/functions/info-discovery/index.ts` as the `info-discovery` Supabase Edge Function. Configure the server-side secrets:

- `INFO_DISCOVERY_ENGINE_URL` — HTTPS endpoint for the research engine.
- `INFO_DISCOVERY_ENGINE_KEY` — private key used by the Edge Function to authenticate to that engine.

The engine receives `action: discover` with the customer's question, optional context and the five-stage pipeline: discover, verify, analyze, connect and outcomes. It must return a customer-safe preview, recommendations, report price and currency. The `action: unlock` call must create a payment checkout or return the full report only after payment has been verified server-side. Keep complete report content out of customer-readable preview rows.

Optional frontend destination variables can be set for product recommendations: `VITE_AGROCLIMATE_URL`, `VITE_ADESUA_URL`, `VITE_INVENTRA_URL`, `VITE_SIKASEM_URL`, `VITE_DATALENS_URL` and `VITE_AMINEVA_SUITE_URL`. Recommendations still appear without these URLs; setting them enables direct navigation.
## Security and data handling

- Row Level Security is enabled on all customer data tables.
- Customers can create and read only their own requests.
- Customers can read only their own released reports and invoices.
- Staff permissions are controlled through `user_roles`.
- Report storage is private.
- Never store card details or secret credentials in the application database.
