import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { Opportunity, ServiceResult } from "@/types/intelligence";

const OPPORTUNITIES_COLLECTION = "opportunities-ava";

export async function listOpportunities(limit = 12): Promise<ServiceResult<Opportunity[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, OPPORTUNITIES_COLLECTION, [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      title: d.title ?? "Opportunity",
      category: (d.category ?? "product") as Opportunity["category"],
      region: d.region,
      industry: d.industry,
      marketReadinessScore: d.marketReadinessScore,
      opportunityScore: d.opportunityScore,
      revenueProjection: d.revenueProjection,
      summary: d.summary,
      submittedBy: d.submittedBy,
      submittedAt: d.$createdAt,
    })) as Opportunity[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
