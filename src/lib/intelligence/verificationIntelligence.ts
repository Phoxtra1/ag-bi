import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { ServiceResult } from "@/types/intelligence";

export interface VerificationRecord {
  id: string;
  subject: string;
  type: "business" | "supplier" | "buyer" | "project" | "asset" | "document" | "claim";
  trustScore?: number;
  credibilityScore?: number;
  status?: string;
  raisedAt?: string;
}

export async function listVerifications(limit = 12): Promise<ServiceResult<VerificationRecord[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, "verifications-ava", [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      subject: d.subject ?? d.title ?? "Subject",
      type: (d.type ?? "business") as VerificationRecord["type"],
      trustScore: d.trustScore,
      credibilityScore: d.credibilityScore,
      status: d.status,
      raisedAt: d.$createdAt,
    })) as VerificationRecord[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
