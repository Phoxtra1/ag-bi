import { databases, DATABASE_ID } from "@/lib/database";
import { Query, ID } from "appwrite";
import type { ServiceResult } from "@/types/intelligence";

const BUSINESS_DATA_COLLECTION = "business_data_entries";
const LS_KEY = "abi.bi.entries";

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
    /* ignore */
  }
}

export async function listBusinessEntries(userId?: string): Promise<ServiceResult<BusinessDataEntry[]>> {
  try {
    const queries = [Query.limit(60), Query.orderAsc("period")];
    if (userId) queries.push(Query.equal("userId", userId));
    const res = await databases.listDocuments(DATABASE_ID, BUSINESS_DATA_COLLECTION, queries);
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
    return { data: readLocal(userId), error: e?.message };
  }
}

export async function saveBusinessEntry(
  entry: Omit<BusinessDataEntry, "id" | "createdAt">,
): Promise<ServiceResult<BusinessDataEntry>> {
  const normalized: BusinessDataEntry = { ...emptyEntry(), ...entry, id: "" };
  try {
    const doc = await databases.createDocument(DATABASE_ID, BUSINESS_DATA_COLLECTION, ID.unique(), {
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
    });
    normalized.id = doc.$id;
    normalized.createdAt = (doc as any).$createdAt;
    return { data: normalized };
  } catch (e: any) {
    normalized.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
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
  grossMargin: number;
  operatingMargin: number;
  revenueGrowthPct: number;
  expenseGrowthPct: number;
  customerGrowthPct: number;
  avgRevenuePerCustomer: number;
  inventoryTurnover: number;
  revenuePerEmployee: number;
  expenseRatio: number;
}

export function computeKPIs(entries: BusinessDataEntry[]): BusinessKPIs {
  const zero: BusinessKPIs = {
    totalRevenue: 0, totalExpenses: 0, netProfit: 0, grossMargin: 0, operatingMargin: 0,
    revenueGrowthPct: 0, expenseGrowthPct: 0, customerGrowthPct: 0,
    avgRevenuePerCustomer: 0, inventoryTurnover: 0, revenuePerEmployee: 0, expenseRatio: 0,
  };
  if (entries.length === 0) return zero;
  const sorted = [...entries].sort((a, b) => a.period.localeCompare(b.period));
  const totalRevenue = sorted.reduce((s, e) => s + e.revenue, 0);
  const totalExpenses = sorted.reduce((s, e) => s + e.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const operatingMargin = last.revenue > 0 ? ((last.revenue - last.expenses) / last.revenue) * 100 : 0;
  const revenueGrowthPct = first.revenue > 0 ? ((last.revenue - first.revenue) / first.revenue) * 100 : 0;
  const expenseGrowthPct = first.expenses > 0 ? ((last.expenses - first.expenses) / first.expenses) * 100 : 0;
  const customerGrowthPct = first.customers > 0 ? ((last.customers - first.customers) / first.customers) * 100 : 0;
  const avgRevenuePerCustomer = last.customers > 0 ? last.revenue / last.customers : 0;
  const inventoryTurnover = last.inventory > 0 ? last.sales / last.inventory : 0;
  const revenuePerEmployee = last.employees > 0 ? last.revenue / last.employees : 0;
  const expenseRatio = last.revenue > 0 ? (last.expenses / last.revenue) * 100 : 0;

  return {
    totalRevenue, totalExpenses, netProfit, grossMargin, operatingMargin,
    revenueGrowthPct, expenseGrowthPct, customerGrowthPct,
    avgRevenuePerCustomer, inventoryTurnover, revenuePerEmployee, expenseRatio,
  };
}

export function forecastSeries(values: number[], periods = 3): number[] {
  if (values.length < 2) return Array(periods).fill(values[0] ?? 0);
  const n = values.length;
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - meanX) * (values[i] - meanY), 0);
  const den = xs.reduce((s, x) => s + (x - meanX) ** 2, 0) || 1;
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return Array.from({ length: periods }, (_, i) => Math.max(0, slope * (n + i) + intercept));
}

// --- CSV Import with validation ---

export interface CSVRowError {
  row: number;
  field: string;
  message: string;
  raw: string;
}

export interface CSVParseResult {
  rows: Omit<BusinessDataEntry, "id" | "createdAt">[];
  errors: CSVRowError[];
  detectedCurrency?: string;
}

const REQUIRED_HEADERS = [
  "period", "revenue", "expenses", "sales", "customers",
  "inventory", "procurement", "suppliers", "employees",
];

const NUMERIC_FIELDS = ["revenue", "expenses", "sales", "customers", "inventory", "procurement", "suppliers", "employees"];

const CURRENCY_RATES: Record<string, number> = {
  "€": 1, EUR: 1,
  "$": 0.92, USD: 0.92,
  "£": 1.17, GBP: 1.17,
};

/** Parses "€1,200.50", "1.2k", "3M", "USD 4500" -> number in EUR (when currency provided). */
function parseNumeric(raw: string): { value: number; currency?: string } {
  if (!raw) return { value: 0 };
  let s = raw.trim();
  let currency: string | undefined;
  for (const sym of ["€", "$", "£", "EUR", "USD", "GBP"]) {
    if (s.toUpperCase().includes(sym)) { currency = sym; s = s.replace(new RegExp(sym, "ig"), ""); }
  }
  s = s.replace(/[, ]/g, "").trim();
  let mult = 1;
  const last = s.slice(-1).toLowerCase();
  if (last === "k") { mult = 1_000; s = s.slice(0, -1); }
  else if (last === "m") { mult = 1_000_000; s = s.slice(0, -1); }
  else if (last === "b") { mult = 1_000_000_000; s = s.slice(0, -1); }
  const n = Number(s);
  if (!Number.isFinite(n)) return { value: NaN, currency };
  let value = n * mult;
  if (currency && CURRENCY_RATES[currency] !== undefined) value = value * CURRENCY_RATES[currency];
  return { value, currency };
}

function validPeriod(p: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(p);
}

function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export function parseCSVDetailed(text: string): CSVParseResult {
  const errors: CSVRowError[] = [];
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { rows: [], errors: [{ row: 0, field: "file", message: "CSV must include a header row and at least one data row.", raw: text.slice(0, 60) }] };
  }
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length) {
    errors.push({ row: 1, field: "header", message: `Missing required columns: ${missing.join(", ")}`, raw: lines[0] });
  }
  const idx = (n: string) => headers.indexOf(n);

  let detectedCurrency: string | undefined;
  const rows: Omit<BusinessDataEntry, "id" | "createdAt">[] = [];

  lines.slice(1).forEach((line, i) => {
    const rowNum = i + 2;
    if (!line.trim()) return;
    const cols = splitCSVLine(line).map((c) => c.trim());
    const period = cols[idx("period")] ?? "";
    if (!validPeriod(period)) {
      errors.push({ row: rowNum, field: "period", message: `Invalid period "${period}". Expected YYYY-MM.`, raw: line });
      return;
    }
    const numbers: Record<string, number> = {};
    let rowHadError = false;
    for (const f of NUMERIC_FIELDS) {
      const raw = cols[idx(f)] ?? "0";
      const { value, currency } = parseNumeric(raw);
      if (currency && !detectedCurrency) detectedCurrency = currency;
      if (!Number.isFinite(value)) {
        errors.push({ row: rowNum, field: f, message: `"${raw}" is not a valid number.`, raw: line });
        rowHadError = true;
        continue;
      }
      if (value < 0) {
        errors.push({ row: rowNum, field: f, message: `${f} cannot be negative (got ${value}).`, raw: line });
        rowHadError = true;
        continue;
      }
      numbers[f] = value;
    }
    if (rowHadError) return;
    rows.push({
      period,
      revenue: numbers.revenue, expenses: numbers.expenses, sales: numbers.sales,
      customers: numbers.customers, inventory: numbers.inventory,
      procurement: numbers.procurement, suppliers: numbers.suppliers, employees: numbers.employees,
    });
  });

  return { rows, errors, detectedCurrency };
}

/** Legacy lenient parser kept for backwards compatibility. */
export function parseCSV(text: string): Omit<BusinessDataEntry, "id" | "createdAt">[] {
  return parseCSVDetailed(text).rows;
}

export function buildCSVTemplate(): string {
  const headers = REQUIRED_HEADERS.join(",");
  const period = new Date().toISOString().slice(0, 7);
  const example = [period, 120000, 78000, 1450, 620, 320, 42000, 14, 22].join(",");
  const prev = new Date(); prev.setMonth(prev.getMonth() - 1);
  const prevPeriod = prev.toISOString().slice(0, 7);
  const example2 = [prevPeriod, 105000, 71000, 1300, 580, 290, 39000, 12, 21].join(",");
  return `${headers}\n${example2}\n${example}\n`;
}
