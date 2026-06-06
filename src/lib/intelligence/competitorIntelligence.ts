import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { Competitor, ServiceResult } from "@/types/intelligence";

const COMPETITORS_COLLECTION = "competitors-ava";

export async function listCompetitors(limit = 20): Promise<ServiceResult<Competitor[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COMPETITORS_COLLECTION, [
      Query.limit(limit),
      Query.orderDesc("$updatedAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      name: d.name ?? "Competitor",
      industry: d.industry,
      country: d.country,
      positioning: d.positioning,
      threatScore: d.threatScore,
      watchedBy: d.watchedBy,
    })) as Competitor[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
