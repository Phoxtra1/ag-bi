/**
 * Phase 1 source acquisition.
 * Search results are source leads, never proof that a claim is true.
 * Only allow-listed official institutional APIs are queried.
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

function cleanText(value: unknown, max = 1000): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : null;
}

function officialLocUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://www.loc.gov${value}`);
    return url.protocol === "https:" && (url.hostname === "loc.gov" || url.hostname.endsWith(".loc.gov"))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

async function searchLibraryOfCongress(query: string): Promise<AcquiredSource[]> {
  const url = new URL("https://www.loc.gov/search/");
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
    const recordUrl = officialLocUrl(item?.id || item?.url);
    const title = cleanText(item?.title, 300);
    if (!recordUrl || !title) return [];
    const description = cleanText(
      Array.isArray(item?.description) ? item.description.join(" ") : item?.description,
      800,
    );
    return [{
      source_id: "loc_json_api",
      institution: "Library of Congress",
      title,
      record_url: recordUrl,
      published_date: cleanText(item?.date || item?.date_created, 80),
      description,
      source_type: "Official library collection record",
      authority_note: "Authoritative for the Library of Congress catalog entry and collection metadata only. The underlying work and any claims within it require separate assessment.",
      retrieval_method: "Official Library of Congress JSON API",
    }];
  });
}

export async function acquireApprovedSources(question: string): Promise<{
  sources: AcquiredSource[];
  source_status: Array<{ source_id: string; status: string; detail?: string }>;
}> {
  const query = question.trim().replace(/\s+/g, " ").slice(0, 300);
  try {
    const sources = await searchLibraryOfCongress(query);
    return {
      sources,
      source_status: [
        { source_id: "loc_json_api", status: "queried", detail: `${sources.length} candidate records returned` },
        { source_id: "nara_catalog_api", status: "credentials_required", detail: "NARA requires an issued API key. Its connector remains disabled until the key is securely configured and its no-caching conditions are implemented." },
        { source_id: "cia_foia_reading_room", status: "manual_review", detail: "Official reading room registered; no automated acquisition enabled in this phase." },
        { source_id: "fbi_vault", status: "manual_review", detail: "Official records portal registered; no automated acquisition enabled in this phase." },
        { source_id: "uk_national_archives_discovery", status: "manual_review", detail: "Official catalogue registered; automated access terms must be confirmed first." },
      ],
    };
  } catch (error) {
    return {
      sources: [],
      source_status: [
        { source_id: "loc_json_api", status: "temporarily_unavailable", detail: String(error instanceof Error ? error.message : "Request failed") },
        { source_id: "nara_catalog_api", status: "credentials_required", detail: "NARA API key and no-caching safeguards are not configured." },
        { source_id: "cia_foia_reading_room", status: "manual_review" },
        { source_id: "fbi_vault", status: "manual_review" },
        { source_id: "uk_national_archives_discovery", status: "manual_review" },
      ],
    };
  }
}
