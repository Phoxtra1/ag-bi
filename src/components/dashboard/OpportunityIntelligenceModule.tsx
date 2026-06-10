import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Target } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import ChartCard from "@/components/intelligence/ChartCard";
import TrendChart from "@/components/intelligence/TrendChart";
import OpportunityCard from "@/components/intelligence/OpportunityCard";
import { listOpportunities } from "@/lib/intelligence/opportunityIntelligence";
import type { Opportunity } from "@/types/intelligence";
import ExportMenu from "@/components/intelligence/ExportMenu";

const OpportunityIntelligenceModule: React.FC = () => {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await listOpportunities(48);
      setItems(res.data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((o) =>
      [o.title, o.summary, o.region, o.industry, o.category].filter(Boolean).join(" ").toLowerCase().includes(t),
    );
  }, [items, q]);

  const avgScore = filtered.length
    ? filtered.reduce((s, o) => s + (o.opportunityScore ?? 0), 0) / filtered.length : 0;
  const totalRevenue = filtered.reduce((s, o) => s + (o.revenueProjection ?? 0), 0);
  const highReady = filtered.filter((o) => (o.marketReadinessScore ?? 0) >= 70).length;

  const scoreSeries = useMemo(() => (
    [...filtered]
      .sort((a, b) => (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0))
      .slice(0, 12)
      .map((o) => ({ label: o.title.slice(0, 10), value: o.opportunityScore ?? 0 }))
  ), [filtered]);

  const revBySector = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => {
      const k = o.industry || o.category || "Other";
      map.set(k, (map.get(k) ?? 0) + (o.revenueProjection ?? 0));
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([label, value]) => ({ label, value }));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><Target size={18} /> Opportunity Intelligence</CardTitle>
              <CardDescription>
                Vetted opportunities scored across readiness, demand and revenue potential.
              </CardDescription>
            </div>
            <ExportMenu
              title="Opportunity Intelligence Export"
              filenameBase="abi-opportunity-intelligence"
              disabled={filtered.length === 0}
              sections={[
                { title: "KPIs", rows: [{ metric: "Opportunities", value: filtered.length }, { metric: "Avg opportunity score", value: avgScore.toFixed(1) }, { metric: "Market-ready (>=70)", value: highReady }, { metric: "Total projected revenue (EUR)", value: totalRevenue }] },
                { title: "Top 12 by score", rows: scoreSeries.map((d) => ({ opportunity: d.label, score: d.value })) },
                { title: "Revenue potential by sector", rows: revBySector.map((d) => ({ sector: d.label, revenue_eur: d.value })) },
                { title: "Opportunities", rows: filtered.map((o) => ({ title: o.title, industry: o.industry ?? "", region: o.region ?? "", score: o.opportunityScore ?? "", readiness: o.marketReadinessScore ?? "", revenue_eur: o.revenueProjection ?? "" })) },
              ]}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Opportunities" value={filtered.length} icon={<Sparkles size={16} />}
          hint="Total opportunities currently visible to you." />
        <KPIStat label="Avg opportunity score" value={avgScore.toFixed(0)}
          hint="Mean score across readiness, demand and projected revenue (0–100)." />
        <KPIStat label="Market-ready (≥70)" value={highReady}
          hint="Opportunities ready for immediate go-to-market action." />
        <KPIStat
          label="Total projected revenue"
          value={new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalRevenue)}
          hint="Sum of revenue projections across all visible opportunities (EUR)."
        />
      </div>

      {filtered.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Top 12 opportunities by score" hint="Highest-scoring opportunities ranked left-to-right.">
            <TrendChart data={scoreSeries} color="#059669" format="number" seriesLabel="Score" />
          </ChartCard>
          <ChartCard title="Revenue potential by sector" hint="Aggregated projected revenue grouped by industry or category.">
            <TrendChart data={revBySector} color="#1D4ED8" format="eur" seriesLabel="Revenue" />
          </ChartCard>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search opportunities…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState
          title="No opportunities yet"
          description="Opportunities appear once products, projects or trade requests are submitted and scored by the admin team."
          icon={<Target size={20} />}
          tip="You can submit something to be considered, or get a head start by recording your Business data."
          actions={[
            { label: "Submit for verification", to: "/dashboard?tab=verify" },
            { label: "Go to Business data", to: "/dashboard?tab=business", variant: "outline" },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
      )}
    </div>
  );
};

export default OpportunityIntelligenceModule;
