import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Building2,
  Globe2,
  LineChart,
  Radar,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { listMarketSignals, listFeaturedReports } from "@/lib/intelligence/marketIntelligence";
import { listOpportunities } from "@/lib/intelligence/opportunityIntelligence";
import { listRiskAlerts } from "@/lib/intelligence/riskIntelligence";

import OpportunityCard from "@/components/intelligence/OpportunityCard";
import RiskBadge from "@/components/intelligence/RiskBadge";
import IntelligenceReportCard from "@/components/intelligence/IntelligenceReportCard";
import EmptyState from "@/components/intelligence/EmptyState";

import type {
  IntelligenceReport,
  MarketSignal,
  Opportunity,
  RiskAlert,
} from "@/types/intelligence";

const PILLARS = [
  { icon: Brain, label: "Business Intelligence" },
  { icon: Globe2, label: "Market Intelligence" },
  { icon: Radar, label: "Competitor Intelligence" },
  { icon: ShieldAlert, label: "Verification Intelligence" },
  { icon: Target, label: "Opportunity Intelligence" },
  { icon: LineChart, label: "Predictive Intelligence" },
  { icon: Sparkles, label: "Decision Intelligence" },
];

const Index: React.FC = () => {
  const [markets, setMarkets] = useState<MarketSignal[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [reports, setReports] = useState<IntelligenceReport[]>([]);

  useEffect(() => {
    (async () => {
      const [m, o, r, rep] = await Promise.all([
        listMarketSignals(8),
        listOpportunities(6),
        listRiskAlerts(6),
        listFeaturedReports(6),
      ]);
      setMarkets(m.data);
      setOpportunities(o.data);
      setRisks(r.data);
      setReports(rep.data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(220_60%_10%)] text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(45 100% 50%) 0, transparent 40%), radial-gradient(circle at 80% 60%, hsl(220 60% 30%) 0, transparent 40%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} /> ABI · Amineva Business Intelligence
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Transform information into <span className="text-accent">actionable intelligence</span>.
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80 leading-relaxed">
              ABI powers businesses, investors, governments, and entrepreneurs with AI-driven
              Business, Market, Competitor, Verification, Opportunity, Predictive and Decision Intelligence —
              globally accessible, with deep coverage across Africa and emerging markets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Launch your workspace <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore intelligence
                </Button>
              </Link>
            </div>
          </div>

          {/* Pillars strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {PILLARS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-4 text-center"
              >
                <Icon size={18} className="text-accent" />
                <span className="text-[11px] font-medium text-primary-foreground/90 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Answer the questions that drive decisions.</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Amniva turns scattered data into clear answers to the six questions every operator, investor and policymaker must ask.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "What is happening?",
            "Why is it happening?",
            "What is likely to happen next?",
            "What opportunities exist?",
            "What risks should be considered?",
            "What actions should be taken?",
          ].map((q) => (
            <div key={q} className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground">
              {q}
            </div>
          ))}
        </div>
      </section>

      {/* Trending markets */}
      <Section
        title="Trending Markets"
        subtitle="Real-time signal from industries, countries and sectors we monitor."
        action={<Link to="/explore" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">Explore <ArrowRight size={14} /></Link>}
      >
        {markets.length === 0 ? (
          <EmptyState
            title="Market signals will appear here"
            description="Connect a feed or wait for the next intelligence sync."
            icon={<TrendingUp size={20} />}
            actions={[
              { label: "Launch workspace", to: "/signup" },
              { label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" },
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {markets.map((m) => (
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
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {m.sentiment ?? "neutral"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Opportunities */}
      <Section
        title="Investment & Business Opportunities"
        subtitle="Vetted opportunities scored across readiness, demand and revenue potential."
        action={<Link to="/dashboard" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">Submit yours <ArrowRight size={14} /></Link>}
      >
        {opportunities.length === 0 ? (
          <EmptyState
            title="No opportunities published yet"
            description="Submitted products, projects and trade requests will surface here once scored."
            icon={<Target size={20} />}
            actions={[
              { label: "Launch workspace", to: "/signup" },
              { label: "Admin: Submission Queue", to: "/admin?tab=content-inbox", variant: "outline" },
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
          </div>
        )}
      </Section>

      {/* Risk alerts */}
      <Section
        title="Business Risk Alerts"
        subtitle="Live signals across market, financial, supply chain, regulatory and operational risks."
      >
        {risks.length === 0 ? (
          <EmptyState
            title="All clear"
            description="No active risk alerts at the moment."
            icon={<ShieldAlert size={20} />}
            actions={[{ label: "Admin: Intelligence Sources", to: "/admin?tab=feed-sources", variant: "outline" }]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {risks.map((r) => <RiskBadge key={r.id} risk={r} />)}
          </div>
        )}
      </Section>

      {/* Featured reports */}
      <Section
        title="Featured Intelligence Reports"
        subtitle="Industry, market, country, investment, trade, risk and opportunity intelligence."
        action={<Link to="/reports" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">All reports <ArrowRight size={14} /></Link>}
      >
        {reports.length === 0 ? (
          <EmptyState
            title="Reports will surface here"
            description="Published intelligence reports appear in this feed."
            icon={<Building2 size={20} />}
            actions={[
              { label: "Browse Reports", to: "/reports" },
              { label: "Admin: Submission Queue", to: "/admin?tab=content-inbox", variant: "outline" },
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => <IntelligenceReportCard key={r.id} report={r} />)}
          </div>
        )}
      </Section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-[hsl(220_60%_12%)] text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Know better. Act smarter.</h3>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              Activate your Executive Dashboard, monitor competitors, evaluate opportunities and forecast outcomes — all from one intelligence workspace.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/pricing"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">See plans</Button></Link>
            <Link to="/signup"><Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">Get started</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Section: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, action, children }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default Index;
