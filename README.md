# Information Solutions by Amineva Global

A focused information services platform with two service areas:

- **Info Discovery** — request-based information discovery, assessment, verification and report delivery.
- **InfoService** — individually scoped professional information services across Career and Education, Business Information, Contracts and Commitments, Travel and Relocation, and Info and Report Verification.

## Product architecture

- React + TypeScript + Vite frontend.
- Supabase Auth for customer accounts.
- Supabase Postgres with Row Level Security for requests, assessments, invoices, payments and reports.
- Private Supabase Storage bucket for report files.
- Staff workflow for request assessment, quotations, invoice issue, manual payment confirmation, report preparation and release.
- No monthly subscription requirement.

The current build is intentionally independent of the previous ABI/Business Intelligence application. Legacy source modules are not imported by the new application entry point.

## Supabase setup

1. Create or select the dedicated Supabase project.
2. Run `supabase/migrations/202611180001_information_solutions.sql` in the Supabase SQL editor.
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
Customer submits a request → staff reviews scope and evidence needs → staff records assessment and quotation → invoice is issued → payment is confirmed → staff prepares report → report is released to the customer's workspace.

### InfoService
Customer submits a professional service request → staff assesses and discusses scope → quotation and invoice are issued → payment is confirmed → work is delivered and report/record is released as appropriate.

The staff console currently supports manual payment confirmation for operational testing. This is not a payment gateway. Stripe checkout and signed webhook confirmation are a later integration; do not mark a payment paid based solely on a browser redirect.

## AI / research integration boundary

The request and report workflow is prepared for a later server-side research and assessment integration. No model provider or assistant identity is exposed in the customer-facing interface. Until that integration is connected, staff can assess requests and prepare reports through the staff console.

When adding automated assessment:
- Run model calls only in server-side functions.
- Validate and rate-limit requests before invoking a model.
- Use lightweight classification for initial triage and reserve deeper research for scoped/approved work.
- Cache reusable research outputs and avoid repeated calls on unchanged inputs.
- Keep secrets server-side; never expose model API keys in frontend environment variables.
- Treat model output as draft research that requires source checks and human review before release.

## Security and data handling

- Row Level Security is enabled on all customer data tables.
- Customers can create and read only their own requests.
- Customers can read only their own released reports and invoices.
- Staff permissions are controlled through `user_roles`.
- Report storage is private.
- Never store card details or secret credentials in the application database.
