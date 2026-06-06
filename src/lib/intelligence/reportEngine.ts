import type { IntelligenceReport, ReportKind } from "@/types/intelligence";

export const REPORT_KINDS: { key: ReportKind; label: string; description: string }[] = [
  { key: "industry", label: "Industry Reports", description: "Sector dynamics, growth drivers, structural shifts." },
  { key: "market", label: "Market Reports", description: "Demand, pricing, regional performance, share movement." },
  { key: "country", label: "Country Reports", description: "Macro indicators, business climate, regulatory landscape." },
  { key: "investment", label: "Investment Reports", description: "Feasibility, returns, capital flows, attractiveness." },
  { key: "trade", label: "Trade Reports", description: "Imports, exports, corridors, tariffs, trade balances." },
  { key: "risk", label: "Risk Reports", description: "Market, regulatory, supply-chain and operational exposure." },
  { key: "opportunity", label: "Opportunity Reports", description: "Niches, buyers, suppliers, growth pockets." },
  { key: "competitor", label: "Competitor Reports", description: "Positioning, moves, threats, benchmarking." },
];

export function filterReports(
  reports: IntelligenceReport[],
  opts: { kind?: ReportKind; query?: string } = {},
): IntelligenceReport[] {
  return reports.filter((r) => {
    if (opts.kind && r.kind !== opts.kind) return false;
    if (opts.query) {
      const q = opts.query.toLowerCase();
      const hay = `${r.title} ${r.summary ?? ""} ${r.region ?? ""} ${r.industry ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
