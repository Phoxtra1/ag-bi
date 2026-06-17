import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe2, TrendingDown, TrendingUp, Search } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import ChartCard from "@/components/intelligence/ChartCard";
import TrendChart from "@/components/intelligence/TrendChart";
import { listMarketSignals } from "@/lib/intelligence/marketIntelligence";
import type { MarketSignal } from "@/types/intelligence";
import ExportMenu from "@/components/intelligence/ExportMenu";

const MarketIntelligenceModule: React.FC = () => {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await listMarketSignals(48);
      setSignals(res.data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return signals;
    return signals.filter((s) =>
      [s.title, s.region, s.industry, s.country, s.sector, s.sentiment]
        .filter(Boolean).join(" ").toLowerCase().includes(term),
    );
  }, [signals, q]);

  const avgChange = filtered.length
    ? filtered.reduce((s, m) => s + (m.changePct ?? 0), 0) / filtered.length : 0;
  const bullish = filtered.filter((s) => s.sentiment === "bullish").length;
  const bearish = filtered.filter((s) => s.sentiment === "bearish").length;
  const neutral = Math.max(0, filtered.length - bullish - bearish);

  // Movement series across signals (sorted by changePct) — shows distribution shape
  const movementSeries = useMemo(() => {
    return [...filtered]
      .filter((s) => typeof s.changePct === "number")
      .sort((a, b) => (a.changePct ?? 0) - (b.changePct ?? 0))
      .map((s, i) => ({ label: `#${i + 1}`, value: Number(s.changePct ?? 0) }));
  }, [filtered]);

  // Industry mix (top 8)
  const industrySeries = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => {
      const k = s.industry || s.sector || "Other";
      map.set(k, (map.get(k) ?? 0) + 1);
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
              <CardTitle className="flex items-center gap-2"><Globe2 size={18} /> Market Intelligence</CardTitle>
              <CardDescription>
                Real-time signals across industries, countries and sectors. Filter to your watchlist and track sentiment.
              </CardDescription>
            </div>
            <ExportMenu
              title="Market Intelligence Export"
              filenameBase="abi-market-intelligence"
              disabled={filtered.length === 0}
              sections={[
                { title: "KPIs", rows: [{ metric: "Signals tracked", value: filtered.length }, { metric: "Avg change %", value: avgChange.toFixed(2) }, { metric: "Bullish", value: bullish }, { metric: "Bearish", value: bearish }, { metric: "Neutral", value: neutral }] },
                { title: "Movement distribution", rows: movementSeries.map((d) => ({ rank: d.label, change_pct: d.value })) },
                { title: "Top industries by signal volume", rows: industrySeries.map((d) => ({ industry: d.label, signals: d.value })) },
                { title: "Signals", rows: filtered.map((m) => ({ title: m.title, region: m.region ?? "", industry: m.industry ?? "", country: m.country ?? "", change_pct: m.changePct ?? "", sentiment: m.sentiment ?? "" })) },
              ]}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Signals tracked" value={filtered.length} icon={<Globe2 size={16} />}
          hint="Active market signals matching your current filter." />
        <KPIStat label="Avg change %" value={`${avgChange.toFixed(1)}%`} changePct={avgChange}
          hint="Mean of recent price/value movement across all filtered signals." />
        <KPIStat label="Bullish" value={bullish} icon={<TrendingUp size={16} />}
          hint="Signals classified as positive/upward momentum." />
        <KPIStat label="Bearish" value={bearish} icon={<TrendingDown size={16} />}
          hint="Signals classified as negative/downward momentum." />
      </div>

      {filtered.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Movement distribution" hint="Each point is one signal's change %, sorted from worst to best — shows how skewed sentiment is.">
            <TrendChart data={movementSeries} color="#1D4ED8" format="pct" seriesLabel="Change" />
          </ChartCard>
          <ChartCard title="Top industries by signal volume" hint="How many tracked signals belong to each industry.">
            <TrendChart data={industrySeries} color="#7C3AED" format="number" seriesLabel="Signals" />
          </ChartCard>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search markets, industries, countries…" className="pl-9" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Sentiment mix — bullish {bullish} · neutral {neutral} · bearish {bearish}
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState
          title="No market signals yet"
          description="Market signals are ingested centrally. As soon as the admin team activates a feed for your industry or region, signals will appear here automatically."
          icon={<Globe2 size={20} />}
          tip="While you wait: enter your Business data so your Executive Overview and forecasts start working today."
          actions={[
            { label: "Go to Business data", to: "/dashboard?tab=business" },
            { label: "Browse Reports", to: "/reports", variant: "outline" },
            { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  {[m.region, m.industry, m.country].filter(Boolean).join(" · ")}
                </div>
                {m.changePct !== undefined && (
                  <div className={`text-lg font-bold ${m.changePct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {m.changePct >= 0 ? "+" : ""}{m.changePct}%
                  </div>
                )}
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.sentiment ?? "neutral"}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketIntelligenceModule;
