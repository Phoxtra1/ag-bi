import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Radar, Search, Shield, Target } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import { listCompetitors } from "@/lib/intelligence/competitorIntelligence";
import type { Competitor } from "@/types/intelligence";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Radar size={18} /> Competitor Intelligence</CardTitle>
          <CardDescription>
            Monitor competitor positioning, threat levels and movements across your industry.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Competitors tracked" value={filtered.length} icon={<Target size={16} />} />
        <KPIStat label="Avg threat score" value={avgThreat.toFixed(0)} />
        <KPIStat label="High threat" value={highThreat} icon={<Shield size={16} />} />
        <KPIStat label="Industries" value={new Set(filtered.map((c) => c.industry).filter(Boolean)).size} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search competitors…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState title="No competitors tracked yet" description="Competitor records will appear here as soon as your watchlist is populated." icon={<Radar size={20} />} />
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
