import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import type { ServiceResult } from "@/types/intelligence";

export interface BuyerRequest {
  id: string;
  buyerName: string;
  product: string;
  category?: string;
  quantity?: number;
  unit?: string;
  region?: string;
  country?: string;
  budgetEur?: number;
  status?: string;
  postedAt?: string;
}

export interface SellerListing {
  id: string;
  sellerName: string;
  product: string;
  category?: string;
  minOrder?: number;
  unit?: string;
  priceEur?: number;
  region?: string;
  country?: string;
  status?: string;
  postedAt?: string;
}

export async function listBuyerRequests(limit = 20): Promise<ServiceResult<BuyerRequest[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, "buyer_requests-ava", [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      buyerName: d.buyerName ?? d.name ?? "Buyer",
      product: d.product ?? d.title ?? "Product",
      category: d.category,
      quantity: d.quantity,
      unit: d.unit,
      region: d.region,
      country: d.country,
      budgetEur: d.budgetEur ?? d.budget,
      status: d.status,
      postedAt: d.$createdAt,
    })) as BuyerRequest[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}

export async function listSellerListings(limit = 20): Promise<ServiceResult<SellerListing[]>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, "seller_listings-ava", [
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      sellerName: d.sellerName ?? d.name ?? "Seller",
      product: d.product ?? d.title ?? "Product",
      category: d.category,
      minOrder: d.minOrder,
      unit: d.unit,
      priceEur: d.priceEur ?? d.price,
      region: d.region,
      country: d.country,
      status: d.status,
      postedAt: d.$createdAt,
    })) as SellerListing[];
    return { data };
  } catch (e: any) {
    return { data: [], error: e?.message };
  }
}
