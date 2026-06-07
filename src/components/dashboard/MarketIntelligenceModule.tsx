import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe2, TrendingDown, TrendingUp, Search } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import { listMarketSignals } from "@/lib/intelligence/marketIntelligence";
import type { MarketSignal } from "@/types/intelligence";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe2 size={18} /> Market Intelligence</CardTitle>
          <CardDescription>
            Real-time signals across industries, countries and sectors. Filter to your watchlist and track sentiment.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Signals tracked" value={filtered.length} icon={<Globe2 size={16} />} />
        <KPIStat label="Avg change" value={`${avgChange.toFixed(1)}%`} changePct={avgChange} />
        <KPIStat label="Bullish" value={bullish} icon={<TrendingUp size={16} />} />
        <KPIStat label="Bearish" value={bearish} icon={<TrendingDown size={16} />} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search markets, industries, countries…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState title="No market signals" description="Signals will appear here as feeds activate." icon={<Globe2 size={20} />} />
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
