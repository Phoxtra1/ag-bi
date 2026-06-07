import { databases, DATABASE_ID } from "@/lib/database";
import { Query, ID } from "appwrite";
import type { ServiceResult } from "@/types/intelligence";

const BUSINESS_DATA_COLLECTION = "business_data_entries";
const LS_KEY = "amniva.bi.entries";

export interface BusinessDataEntry {
  id: string;
  period: string; // YYYY-MM
  revenue: number;
  expenses: number;
  sales: number;
  customers: number;
  inventory: number;
  procurement: number;
  suppliers: number;
  employees: number;
  userId?: string;
  createdAt?: string;
}

const emptyEntry = (): Omit<BusinessDataEntry, "id" | "period"> => ({
  revenue: 0,
  expenses: 0,
  sales: 0,
  customers: 0,
  inventory: 0,
  procurement: 0,
  suppliers: 0,
  employees: 0,
});

function readLocal(userId?: string): BusinessDataEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const all: BusinessDataEntry[] = raw ? JSON.parse(raw) : [];
    return userId ? all.filter((e) => e.userId === userId) : all;
  } catch {
    return [];
  }
}

function writeLocal(entries: BusinessDataEntry[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export async function listBusinessEntries(
  userId?: string,
): Promise<ServiceResult<BusinessDataEntry[]>> {
  try {
    const queries = [Query.limit(60), Query.orderAsc("period")];
    if (userId) queries.push(Query.equal("userId", userId));
    const res = await databases.listDocuments(
      DATABASE_ID,
      BUSINESS_DATA_COLLECTION,
      queries,
    );
    const data = res.documents.map((d: any) => ({
      id: d.$id,
      period: d.period,
      revenue: d.revenue ?? 0,
      expenses: d.expenses ?? 0,
      sales: d.sales ?? 0,
      customers: d.customers ?? 0,
      inventory: d.inventory ?? 0,
      procurement: d.procurement ?? 0,
      suppliers: d.suppliers ?? 0,
      employees: d.employees ?? 0,
      userId: d.userId,
      createdAt: d.$createdAt,
    })) as BusinessDataEntry[];
    return { data };
  } catch (e: any) {
    // Graceful fallback to local cache when collection missing
    return { data: readLocal(userId), error: e?.message };
  }
}

export async function saveBusinessEntry(
  entry: Omit<BusinessDataEntry, "id" | "createdAt">,
): Promise<ServiceResult<BusinessDataEntry>> {
  const normalized: BusinessDataEntry = {
    ...emptyEntry(),
    ...entry,
    id: "",
  };
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      BUSINESS_DATA_COLLECTION,
      ID.unique(),
      {
        period: entry.period,
        revenue: entry.revenue,
        expenses: entry.expenses,
        sales: entry.sales,
        customers: entry.customers,
        inventory: entry.inventory,
        procurement: entry.procurement,
        suppliers: entry.suppliers,
        employees: entry.employees,
        userId: entry.userId,
      },
    );
    normalized.id = doc.$id;
    normalized.createdAt = (doc as any).$createdAt;
    return { data: normalized };
  } catch (e: any) {
    // fallback: persist locally
    normalized.id = `local-${Date.now()}`;
    normalized.createdAt = new Date().toISOString();
    const existing = readLocal();
    writeLocal([...existing, normalized]);
    return { data: normalized, error: e?.message };
  }
}

export async function bulkImportEntries(
  rows: Omit<BusinessDataEntry, "id" | "createdAt">[],
): Promise<ServiceResult<BusinessDataEntry[]>> {
  const saved: BusinessDataEntry[] = [];
  for (const row of rows) {
    const { data } = await saveBusinessEntry(row);
    saved.push(data);
  }
  return { data: saved };
}

// --- KPI computations ---

export interface BusinessKPIs {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  grossMargin: number; // %
  revenueGrowthPct: number;
  customerGrowthPct: number;
  avgRevenuePerCustomer: number;
  inventoryTurnover: number;
  revenuePerEmployee: number;
}

export function computeKPIs(entries: BusinessDataEntry[]): BusinessKPIs {
  if (entries.length === 0) {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      grossMargin: 0,
      revenueGrowthPct: 0,
      customerGrowthPct: 0,
      avgRevenuePerCustomer: 0,
      inventoryTurnover: 0,
      revenuePerEmployee: 0,
    };
  }
  const sorted = [...entries].sort((a, b) => a.period.localeCompare(b.period));
  const totalRevenue = sorted.reduce((s, e) => s + e.revenue, 0);
  const totalExpenses = sorted.reduce((s, e) => s + e.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const revenueGrowthPct =
    first.revenue > 0 ? ((last.revenue - first.revenue) / first.revenue) * 100 : 0;
  const customerGrowthPct =
    first.customers > 0
      ? ((last.customers - first.customers) / first.customers) * 100
      : 0;

  const avgRevenuePerCustomer =
    last.customers > 0 ? last.revenue / last.customers : 0;
  const inventoryTurnover =
    last.inventory > 0 ? last.sales / last.inventory : 0;
  const revenuePerEmployee =
    last.employees > 0 ? last.revenue / last.employees : 0;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    grossMargin,
    revenueGrowthPct,
    customerGrowthPct,
    avgRevenuePerCustomer,
    inventoryTurnover,
    revenuePerEmployee,
  };
}

// Simple linear-trend forecast for next N periods
export function forecastSeries(
  values: number[],
  periods = 3,
): number[] {
  if (values.length < 2) return Array(periods).fill(values[0] ?? 0);
  const n = values.length;
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - meanX) * (values[i] - meanY), 0);
  const den = xs.reduce((s, x) => s + (x - meanX) ** 2, 0) || 1;
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return Array.from({ length: periods }, (_, i) =>
    Math.max(0, slope * (n + i) + intercept),
  );
}

export function parseCSV(text: string): Omit<BusinessDataEntry, "id" | "createdAt">[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const num = (n: string) => Number(cols[idx(n)] ?? 0) || 0;
    return {
      period: cols[idx("period")] ?? new Date().toISOString().slice(0, 7),
      revenue: num("revenue"),
      expenses: num("expenses"),
      sales: num("sales"),
      customers: num("customers"),
      inventory: num("inventory"),
      procurement: num("procurement"),
      suppliers: num("suppliers"),
      employees: num("employees"),
    };
  });
}
