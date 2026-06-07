import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Target } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import OpportunityCard from "@/components/intelligence/OpportunityCard";
import { listOpportunities } from "@/lib/intelligence/opportunityIntelligence";
import type { Opportunity } from "@/types/intelligence";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target size={18} /> Opportunity Intelligence</CardTitle>
          <CardDescription>
            Vetted opportunities scored across readiness, demand and revenue potential.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Opportunities" value={filtered.length} icon={<Sparkles size={16} />} />
        <KPIStat label="Avg opportunity score" value={avgScore.toFixed(0)} />
        <KPIStat label="Market-ready" value={highReady} />
        <KPIStat
          label="Total projected revenue"
          value={new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalRevenue)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search opportunities…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? null : filtered.length === 0 ? (
        <EmptyState title="No opportunities yet" description="Submitted products, projects and trade requests will appear here once scored." icon={<Target size={20} />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
      )}
    </div>
  );
};

export default OpportunityIntelligenceModule;
