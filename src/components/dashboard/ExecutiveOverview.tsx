import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ScoreCard from "@/components/intelligence/ScoreCard";
import KPIStat from "@/components/intelligence/KPIStat";
import OpportunityCard from "@/components/intelligence/OpportunityCard";
import RiskBadge from "@/components/intelligence/RiskBadge";
import EmptyState from "@/components/intelligence/EmptyState";
import { computeScores, EMPTY_SCORES } from "@/lib/intelligence/scoringEngine";
import { listOpportunities } from "@/lib/intelligence/opportunityIntelligence";
import { listRiskAlerts } from "@/lib/intelligence/riskIntelligence";
import { listMarketSignals } from "@/lib/intelligence/marketIntelligence";
import {
  listBusinessEntries,
  computeKPIs,
  type BusinessDataEntry,
} from "@/lib/intelligence/businessIntelligence";
import { getCurrentUser } from "@/lib/auth";
import type { IntelligenceScores, Opportunity, RiskAlert, MarketSignal } from "@/types/intelligence";
import { Building2, Globe2, ShieldAlert, Target, TrendingUp } from "lucide-react";

const ExecutiveOverview: React.FC = () => {
  const [scores, setScores] = useState<IntelligenceScores>(EMPTY_SCORES);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [entries, setEntries] = useState<BusinessDataEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser().catch(() => null);
        const [o, r, s, b] = await Promise.all([
          listOpportunities(6),
          listRiskAlerts(6),
          listMarketSignals(8),
          listBusinessEntries(user?.$id),
        ]);
        setOpps(o.data);
        setRisks(r.data);
        setSignals(s.data);
        setEntries(b.data);
        const kpis = computeKPIs(b.data);
        setScores(
          computeScores({
            opportunities: o.data,
            risks: r.data,
            marketSignals: s.data,
            revenueGrowthPct: kpis.revenueGrowthPct,
          }),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = computeKPIs(entries);
  const eur = (n: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard label="Intelligence" value={scores.intelligence} tone="primary" />
        <ScoreCard label="Growth" value={scores.growth} tone="success" />
        <ScoreCard label="Opportunity" value={scores.opportunity} tone="accent" />
        <ScoreCard label="Risk" value={scores.risk} tone="destructive" />
        <ScoreCard label="Market Confidence" value={scores.marketConfidence} tone="warning" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat
          label="Revenue"
          value={eur(kpis.totalRevenue)}
          changePct={kpis.revenueGrowthPct}
          icon={<TrendingUp size={16} />}
        />
        <KPIStat
          label="Net Profit"
          value={eur(kpis.netProfit)}
          changePct={kpis.grossMargin}
          icon={<Building2 size={16} />}
        />
        <KPIStat
          label="Opportunities"
          value={opps.length}
          icon={<Target size={16} />}
        />
        <KPIStat
          label="Open Risks"
          value={risks.length}
          icon={<ShieldAlert size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Opportunities</CardTitle>
            <CardDescription>Highest-scoring intelligence opportunities surfaced for you</CardDescription>
          </CardHeader>
          <CardContent>
            {opps.length === 0 ? (
              <EmptyState
                title="No opportunities yet"
                description="Opportunities are ingested by the admin team. Submit one for review or start building your private intelligence with your own Business data."
                actions={[
                  { label: "Submit for review", to: "/dashboard?tab=verify" },
                  { label: "Enter Business data", to: "/dashboard?tab=business", variant: "outline" },
                ]}
              />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {opps.slice(0, 4).map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Watch</CardTitle>
            <CardDescription>Active alerts across market, supply, regulatory and operational risks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {risks.length === 0 ? (
              <EmptyState
                title="No active risks"
                description="No risk alerts are open for your scope right now. Alerts will appear here as the team publishes them."
              />
            ) : (
              risks.slice(0, 6).map((r) => <RiskBadge key={r.id} risk={r} />)
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 size={18} /> Market Signals
          </CardTitle>
          <CardDescription>Live sentiment and movement from tracked markets</CardDescription>
        </CardHeader>
        <CardContent>
          {signals.length === 0 ? (
            <EmptyState
              title="No market signals yet"
              description="Market signals populate as feeds are activated by the admin team."
              actions={[{ label: "Open Market tab", to: "/dashboard?tab=market" }]}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {signals.slice(0, 8).map((s) => (
                <div key={s.id} className="rounded-lg border p-3">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.region ?? s.country ?? "Global"} · {s.sector ?? s.industry ?? "—"}
                  </div>
                  {s.changePct !== undefined && (
                    <div
                      className={`mt-1 text-sm font-semibold ${
                        s.changePct >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {s.changePct >= 0 ? "+" : ""}
                      {s.changePct.toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && <div className="text-xs text-muted-foreground">Loading intelligence context…</div>}
    </div>
  );
};

export default ExecutiveOverview;
