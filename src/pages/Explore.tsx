import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";

import { listMarketSignals } from "@/lib/intelligence/marketIntelligence";
import { listOpportunities } from "@/lib/intelligence/opportunityIntelligence";
import { listCompetitors } from "@/lib/intelligence/competitorIntelligence";
import { listRiskAlerts } from "@/lib/intelligence/riskIntelligence";
import OpportunityCard from "@/components/intelligence/OpportunityCard";
import RiskBadge from "@/components/intelligence/RiskBadge";
import EmptyState from "@/components/intelligence/EmptyState";

import type { Competitor, MarketSignal, Opportunity, RiskAlert } from "@/types/intelligence";

const TAXONOMIES = [
  "Industries",
  "Markets",
  "Countries",
  "Sectors",
  "Commodities",
  "Trade",
  "Economic",
];

const Explore: React.FC = () => {
  const [q, setQ] = useState("");
  const [markets, setMarkets] = useState<MarketSignal[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [risks, setRisks] = useState<RiskAlert[]>([]);

  useEffect(() => {
    (async () => {
      const [m, o, c, r] = await Promise.all([
        listMarketSignals(40),
        listOpportunities(40),
        listCompetitors(40),
        listRiskAlerts(40),
      ]);
      setMarkets(m.data);
      setOpportunities(o.data);
      setCompetitors(c.data);
      setRisks(r.data);
    })();
  }, []);

  const filterText = q.trim().toLowerCase();
  const filter = <T extends Record<string, any>>(items: T[], keys: (keyof T)[]) =>
    !filterText
      ? items
      : items.filter((i) =>
          keys.some((k) => String(i[k] ?? "").toLowerCase().includes(filterText)),
        );

  const filteredMarkets = useMemo(
    () => filter(markets, ["title", "region", "industry", "country", "sector"]),
    [markets, filterText],
  );
  const filteredOpps = useMemo(
    () => filter(opportunities, ["title", "region", "industry", "category", "summary"]),
    [opportunities, filterText],
  );
  const filteredComps = useMemo(
    () => filter(competitors, ["name", "industry", "country", "positioning"]),
    [competitors, filterText],
  );
  const filteredRisks = useMemo(
    () => filter(risks, ["title", "region", "industry", "category", "summary"]),
    [risks, filterText],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Explore Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Browse industries, markets, countries, sectors, commodities, opportunities, trade and economic intelligence.
          </p>
        </div>

        <div className="relative mb-6 max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any market, industry, country, opportunity..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TAXONOMIES.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {t}
            </span>
          ))}
        </div>

        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="markets">
            {filteredMarkets.length === 0 ? (
              <EmptyState
                title="No market signals match"
                description="Try a different search, or wait for the admin team to ingest more feeds."
                actions={[
                  { label: "Go to Business data", to: "/dashboard?tab=business" },
                  { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
                ]}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredMarkets.map((m) => (
                  <Card key={m.id}>
                    <CardHeader className="pb-2"><CardTitle className="text-base">{m.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {[m.region, m.industry, m.country].filter(Boolean).join(" · ")}
                      </div>
                      {m.changePct !== undefined && (
                        <div className={`text-lg font-bold ${m.changePct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {m.changePct >= 0 ? "+" : ""}{m.changePct}%
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="opportunities">
            {filteredOpps.length === 0 ? (
              <EmptyState
                title="No opportunities match"
                description="Submit one for verification, or wait for new opportunities to be approved."
                actions={[
                  { label: "Submit for verification", to: "/dashboard?tab=verify" },
                  { label: "Admin: Submission Queue", to: "/admin?tab=content-inbox", variant: "outline" },
                ]}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOpps.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="competitors">
            {filteredComps.length === 0 ? (
              <EmptyState
                title="No competitors tracked yet"
                description="Competitor records are published from the admin Intelligence Sources."
                actions={[
                  { label: "Request analysis", to: "/dashboard?tab=verify" },
                  { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
                ]}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComps.map((c) => (
                  <Card key={c.id}>
                    <CardHeader className="pb-2"><CardTitle className="text-base">{c.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      <div>{[c.industry, c.country].filter(Boolean).join(" · ")}</div>
                      {c.positioning && <p className="line-clamp-2">{c.positioning}</p>}
                      {c.threatScore !== undefined && (
                        <div className="text-xs">Threat score <span className="font-semibold text-foreground">{c.threatScore}</span></div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="risks">
            {filteredRisks.length === 0 ? (
              <EmptyState
                title="No risks match"
                description="Risk alerts appear once published by the admin team."
                actions={[
                  { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
                ]}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredRisks.map((r) => <RiskBadge key={r.id} risk={r} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
