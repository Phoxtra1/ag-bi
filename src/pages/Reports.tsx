import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import { listFeaturedReports } from "@/lib/intelligence/marketIntelligence";
import { REPORT_KINDS, filterReports } from "@/lib/intelligence/reportEngine";
import IntelligenceReportCard from "@/components/intelligence/IntelligenceReportCard";
import EmptyState from "@/components/intelligence/EmptyState";
import type { IntelligenceReport, ReportKind } from "@/types/intelligence";

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [kind, setKind] = useState<ReportKind | "all">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const res = await listFeaturedReports(60);
      setReports(res.data);
    })();
  }, []);

  const filtered = useMemo(
    () => filterReports(reports, { kind: kind === "all" ? undefined : kind, query: q }),
    [reports, kind, q],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Intelligence Reports</h1>
          <p className="text-muted-foreground mt-1">
            Industry, market, country, investment, trade, risk, opportunity and competitor reports.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <div className="relative md:max-w-md flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reports by title, region, industry..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={kind === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setKind("all")}
          >
            All
          </Button>
          {REPORT_KINDS.map((k) => (
            <Button
              key={k.key}
              variant={kind === k.key ? "default" : "outline"}
              size="sm"
              onClick={() => setKind(k.key)}
            >
              {k.label}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No reports match"
            description="Try a different filter or come back after the next publishing cycle."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => <IntelligenceReportCard key={r.id} report={r} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
