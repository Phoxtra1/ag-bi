-- Phase 1: curated, governed source register.
-- Registry entries describe approved institutional access routes; they do not
-- certify the truth of every record or claim hosted by those institutions.
create table if not exists public.info_source_registry (
  id text primary key,
  institution text not null,
  source_name text not null,
  source_type text not null,
  official_url text not null,
  access_method text not null,
  integration_status text not null check (integration_status in ('active','credentials_required','manual_review','disabled')),
  authority_scope text not null,
  access_and_reuse_notes text not null,
  last_policy_reviewed date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.info_source_registry enable row level security;
revoke all on public.info_source_registry from anon, authenticated;

insert into public.info_source_registry
  (id,institution,source_name,source_type,official_url,access_method,integration_status,authority_scope,access_and_reuse_notes,last_policy_reviewed)
values
  ('loc_json_api','Library of Congress','Library of Congress JSON/YAML API','National library collection','https://www.loc.gov/apis/json-and-yaml/','Official public JSON API; rate-limited; no API key required','active','Authoritative for Library of Congress catalog metadata and collection records; underlying works and claims need item-level assessment.','Follow API rate limits. Check item-level rights before reproducing or redistributing any work; public access does not automatically grant reuse rights.','2026-11-19'),
  ('nara_catalog_api','US National Archives and Records Administration','National Archives Catalog API','National government archive','https://www.archives.gov/research/catalog/help/api','Official read-only API; NARA-issued API key required','credentials_required','Authoritative for NARA catalog descriptions, archival identifiers and official release metadata; not a blanket guarantee that every statement in a record is true.','Use a read-only key. Default limit is 10,000 queries/month. NARA states not to cache or store API content; do not persist returned API content. Display NARA-required non-endorsement notice when presenting API content.','2026-11-19'),
  ('cia_foia_reading_room','Central Intelligence Agency','CIA FOIA Electronic Reading Room','Official declassified-record collection','https://www.cia.gov/readingroom/','Official public website; manual source review only in this phase','manual_review','Authoritative for records the CIA itself has officially released through its reading room; authenticity of copies elsewhere is not established by the source name alone.','Only records officially released and lawfully public. Preserve redactions; do not infer withheld content. No automated crawler enabled in this phase.','2026-11-19'),
  ('fbi_vault','Federal Bureau of Investigation','FBI Vault','Official released-record collection','https://vault.fbi.gov/','Official public website; manual source review only in this phase','manual_review','Authoritative for records the FBI itself has published in the Vault; record contents still require contextual and claim-level assessment.','Use only material openly published by the FBI. No automated crawler enabled in this phase.','2026-11-19'),
  ('uk_national_archives_discovery','The National Archives (UK)','Discovery Catalogue','National government archive catalogue','https://discovery.nationalarchives.gov.uk/','Official public catalogue; API automation pending confirmation of current access terms','manual_review','Authoritative for catalogue descriptions supplied by The National Archives and participating repositories; underlying record status must be checked.','Do not automate access until current API access conditions, rate limits and reuse terms are confirmed.','2026-11-19')
on conflict (id) do update set
  institution=excluded.institution,
  source_name=excluded.source_name,
  source_type=excluded.source_type,
  official_url=excluded.official_url,
  access_method=excluded.access_method,
  integration_status=excluded.integration_status,
  authority_scope=excluded.authority_scope,
  access_and_reuse_notes=excluded.access_and_reuse_notes,
  last_policy_reviewed=excluded.last_policy_reviewed,
  updated_at=now();
