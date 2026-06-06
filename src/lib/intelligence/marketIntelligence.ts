import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { MarketSignal, ServiceResult, IntelligenceReport } from "@/types/intelligence";

const MARKETS_COLLECTION = "markets-ava";

export async function listMarketSignals(limit = 12): Promise<ServiceResult<MarketSignal[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, MARKETS_COLLECTION, [
      Query.limit(limit),
      Query.orderDesc("$updatedAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      title: d.title ?? d.name ?? "Untitled market",
      region: d.region,
      sector: d.sector,
      industry: d.industry,
      country: d.country,
      changePct: d.changePct,
      sentiment: d.sentiment ?? "neutral",
      updatedAt: d.$updatedAt,
      source: d.source,
    })) as MarketSignal[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}

export async function listFeaturedReports(limit = 6): Promise<ServiceResult<IntelligenceReport[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, "reports-ava", [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      title: d.title ?? d.subject ?? "Intelligence report",
      kind: (d.kind ?? d.category ?? "market") as IntelligenceReport["kind"],
      summary: d.summary ?? d.description,
      region: d.region,
      industry: d.industry,
      publishedAt: d.$createdAt,
      author: d.author ?? d.submittedBy,
      premium: !!d.premium,
    })) as IntelligenceReport[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
