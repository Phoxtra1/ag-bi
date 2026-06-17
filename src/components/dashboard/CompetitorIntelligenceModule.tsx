import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Radar, Search, Shield, Target } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import ChartCard from "@/components/intelligence/ChartCard";
import TrendChart from "@/components/intelligence/TrendChart";
import { listCompetitors } from "@/lib/intelligence/competitorIntelligence";
import type { Competitor } from "@/types/intelligence";
import ExportMenu from "@/components/intelligence/ExportMenu";

const threatTone = (s?: number) =>
  s === undefined ? "bg-muted text-foreground" :
  s >= 75 ? "bg-red-100 text-red-700 border-red-200" :
  s >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" :
  "bg-emerald-100 text-emerald-700 border-emerald-200";

const CompetitorIntelligenceModule: React.FC = () => {
  const [items, setItems] = useState<Competitor[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await listCompetitors(50);
      setItems(res.data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((c) =>
      [c.name, c.industry, c.country, c.positioning].filter(Boolean).join(" ").toLowerCase().includes(t),
    );
  }, [items, q]);

  const avgThreat = filtered.length
    ? filtered.reduce((s, c) => s + (c.threatScore ?? 0), 0) / filtered.length : 0;
  const highThreat = filtered.filter((c) => (c.threatScore ?? 0) >= 75).length;
  const medThreat = filtered.filter((c) => { const s = c.threatScore ?? 0; return s >= 50 && s < 75; }).length;
  const lowThreat = filtered.filter((c) => (c.threatScore ?? 0) < 50).length;

  const threatSeries = useMemo(() => (
    [...filtered]
      .sort((a, b) => (b.threatScore ?? 0) - (a.threatScore ?? 0))
      .slice(0, 12)
      .map((c) => ({ label: c.name.slice(0, 10), value: c.threatScore ?? 0 }))
  ), [filtered]);

  const distSeries = [
    { label: "Low (<50)", value: lowThreat },
    { label: "Medium", value: medThreat },
    { label: "High (75+)", value: highThreat },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><Radar size={18} /> Competitor Intelligence</CardTitle>
              <CardDescription>
                Monitor competitor positioning, threat levels and movements across your industry.
              </CardDescription>
            </div>
            <ExportMenu
              title="Competitor Intelligence Export"
              filenameBase="abi-competitor-intelligence"
              disabled={filtered.length === 0}
              sections={[
                { title: "KPIs", rows: [{ metric: "Competitors tracked", value: filtered.length }, { metric: "Avg threat score", value: avgThreat.toFixed(1) }, { metric: "High threat (>=75)", value: highThreat }, { metric: "Medium threat", value: medThreat }, { metric: "Low threat", value: lowThreat }] },
                { title: "Top 12 by threat", rows: threatSeries.map((d) => ({ competitor: d.label, threat: d.value })) },
                { title: "Threat distribution", rows: distSeries.map((d) => ({ band: d.label, count: d.value })) },
                { title: "Competitors", rows: filtered.map((c) => ({ name: c.name, industry: c.industry ?? "", country: c.country ?? "", threat_score: c.threatScore ?? "", positioning: c.positioning ?? "" })) },
              ]}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Competitors tracked" value={filtered.length} icon={<Target size={16} />}
          hint="Number of competitors currently in your watchlist." />
        <KPIStat label="Avg threat score" value={avgThreat.toFixed(0)}
          hint="Mean threat score (0–100). Higher = more competitive pressure." />
        <KPIStat label="High threat (≥75)" value={highThreat} icon={<Shield size={16} />}
          hint="Competitors with a threat score of 75 or above — immediate strategic priority." />
        <KPIStat label="Industries covered" value={new Set(filtered.map((c) => c.industry).filter(Boolean)).size}
          hint="Distinct industries represented in your competitor set." />
      </div>

      {filtered.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Top 12 competitors by threat" hint="Highest-scoring competitors right now.">
            <TrendChart data={threatSeries} color="#DC2626" format="number" seriesLabel="Threat" />
          </ChartCard>
          <ChartCard title="Threat distribution" hint="How your tracked set splits across low/medium/high threat bands.">
            <TrendChart data={distSeries} color="#B45309" format="number" seriesLabel="Competitors" />
          </ChartCard>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search competitors…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState
          title="No competitors tracked yet"
          description="Competitor records and threat scores are published from the admin Intelligence Sources. Nothing has been ingested for your scope yet."
          icon={<Radar size={20} />}
          tip="In the meantime, populate Business data to start your own benchmark."
          actions={[
            { label: "Go to Business data", to: "/dashboard?tab=business" },
            { label: "Request analysis", to: "/dashboard?tab=verify", variant: "outline" },
            { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <Badge variant="outline" className={threatTone(c.threatScore)}>
                    Threat {c.threatScore ?? "—"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="text-xs text-muted-foreground">
                  {[c.industry, c.country].filter(Boolean).join(" · ") || "—"}
                </div>
                {c.positioning && <p className="text-sm text-muted-foreground line-clamp-3">{c.positioning}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitorIntelligenceModule;
