/**
 * Phase 1 source acquisition.
 *
 * Connectors are deliberately allow-listed. Search results are source leads,
 * not proof that a claim is true. Original records must be opened and assessed.
 * NARA responses are used transiently only; NARA's API terms prohibit caching
 * or storing returned content.
 */
export type AcquiredSource = {
  source_id: string;
  institution: string;
  title: string;
  record_url: string;
  published_date: string | null;
  description: string | null;
  source_type: string;
  authority_note: string;
  retrieval_method: string;
};

const LOC_BASE = "https://www.loc.gov/search/";
const NARA_BASE = "https://catalog.archives.gov/api/v2/records/search";

function cleanText(value: unknown, max = 1200): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : null;
}

function officialUrl(value: unknown, allowedHost: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${allowedHost}${value}`);
    return url.protocol === "https:" && (url.hostname === allowedHost || url.hostname.endsWith(`.${allowedHost}`))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

async function searchLibraryOfCongress(query: string): Promise<AcquiredSource[]> {
  const url = new URL(LOC_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("fo", "json");
  url.searchParams.set("c", "8");
  url.searchParams.set("at", "results");
  const response = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "AminevaGlobal-InfoDiscovery/1.0 (source discovery)" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Library of Congress returned HTTP ${response.status}`);
  const data = await response.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.flatMap((item: any) => {
    const recordUrl = officialUrl(item?.id || item?.url, "loc.gov");
    if (!recordUrl) return [];
    const title = cleanText(item?.title, 300);
    if (!title) return [];
    const description = cleanText(
      Array.isArray(item?.description) ? item.description.join(" ") : item?.description,
      1000,
    );
    return [{
      source_id: "loc_json_api",
      institution: "Library of Congress",
      title,
      record_url: recordUrl,
      published_date: cleanText(item?.date || item?.date_created, 80),
      description,
      source_type: "Official library collection record",
      authority_note: "The Library of Congress is authoritative for its own catalog record and collection metadata. The record's underlying content and any claims within it require separate assessment.",
      retrieval_method: "Official Library of Congress JSON API",
    }];
  });
}

async function searchNara(query: string): Promise<AcquiredSource[]> {
  const apiKey = Deno.env.get("NARA_API_KEY");
  if (!apiKey) return [];
  const url = new URL(NARA_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("availableOnline", "true");
  url.searchParams.set("rows", "5");
  const response = await fetch(url, {
    headers: { "Accept": "application/json", "x-api-key": apiKey },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`NARA Catalog API returned HTTP ${response.status}`);
  const data = await response.json();
  const hits = data?.body?.hits?.hits || data?.hits?.hits || [];
  return hits.flatMap((hit: any) => {
    const metadata = hit?._source?.metadata || hit?._source || {};
    const naId = metadata?.naId || metadata?.identifier || hit?._id;
    if (!naId) return [];
    const recordUrl = `https://catalog.archives.gov/id/${encodeURIComponent(String(naId))}`;
    const title = cleanText(metadata?.title || metadata?.description?.item?.title || metadata?.scopeAndContentNote, 300);
    if (!title) return [];
    return [{
      source_id: "nara_catalog_api",
      institution: "US National Archives and Records Administration",
      title,
      record_url: recordUrl,
      published_date: cleanText(metadata?.productionDate || metadata?.date || null, 80),
      description: cleanText(metadata?.scopeAndContentNote || metadata?.description?.item?.scopeAndContentNote, 1000),
      source_type: "Official federal archival catalog record",
      authority_note: "NARA is authoritative for its catalog descriptions and record-release metadata. A catalog entry does not by itself establish the truth of statements in the underlying record.",
      retrieval_method: "Official NARA Catalog API (live, transient lookup; results are not stored)",
    }];
  });
}

export async function acquireApprovedSources(question: string): Promise<{
  sources: AcquiredSource[];
  source_status: Array<{ source_id: string; status: string; detail?: string }>;
}> {
  const query = question.trim().replace(/\s+/g, " ").slice(0, 300);
  const [loc, nara] = await Promise.allSettled([
    searchLibraryOfCongress(query),
    searchNara(query),
  ]);
  const sources: AcquiredSource[] = [];
  const source_status: Array<{ source_id: string; status: string; detail?: string }> = [];

  if (loc.status === "fulfilled") {
    sources.push(...loc.value);
    source_status.push({ source_id: "loc_json_api", status: "queried", detail: `${loc.value.length} candidate records returned` });
  } else {
    source_status.push({ source_id: "loc_json_api", status: "temporarily_unavailable", detail: String(loc.reason?.message || "Request failed") });
  }

  if (!Deno.env.get("NARA_API_KEY")) {
    source_status.push({ source_id: "nara_catalog_api", status: "credentials_required", detail: "A NARA-issued read-only API key must be added as the NARA_API_KEY secret before live queries can run." });
  } else if (nara.status === "fulfilled") {
    sources.push(...nara.value);
    source_status.push({ source_id: "nara_catalog_api", status: "queried", detail: `${nara.value.length} candidate records returned; results are not persisted` });
  } else {
    source_status.push({ source_id: "nara_catalog_api", status: "temporarily_unavailable", detail: String(nara.reason?.message || "Request failed") });
  }

  return { sources, source_status };
}
