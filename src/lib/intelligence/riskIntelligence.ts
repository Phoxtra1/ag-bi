import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { RiskAlert, ServiceResult } from "@/types/intelligence";

const RISKS_COLLECTION = "risk-alerts-ava";

export async function listRiskAlerts(limit = 10): Promise<ServiceResult<RiskAlert[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, RISKS_COLLECTION, [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      title: d.title ?? "Risk alert",
      category: (d.category ?? "market") as RiskAlert["category"],
      severity: (d.severity ?? "medium") as RiskAlert["severity"],
      riskScore: d.riskScore ?? 0,
      region: d.region,
      industry: d.industry,
      summary: d.summary,
      raisedAt: d.$createdAt,
    })) as RiskAlert[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
