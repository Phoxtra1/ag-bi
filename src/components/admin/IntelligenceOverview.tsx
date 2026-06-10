import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { databases, DATABASE_ID } from "@/lib/database";
import { Query } from "appwrite";
import { Globe2, Radar, Target, Handshake, ShieldAlert, FileText, RefreshCw } from "lucide-react";

interface Slot {
  key: string;
  label: string;
  collection: string;
  icon: React.ReactNode;
  hint: string;
  ingestTab: string;
}

const SLOTS: Slot[] = [
  { key: "markets", label: "Market signals", collection: "markets-ava", icon: <Globe2 size={16} />, hint: "Drives the Market Intelligence tab and Executive Overview signals strip.", ingestTab: "feed-sources" },
  { key: "competitors", label: "Competitors", collection: "competitors", icon: <Radar size={16} />, hint: "Powers Competitor Intelligence and threat scoring.", ingestTab: "feed-sources" },
  { key: "opportunities", label: "Opportunities", collection: "opportunities", icon: <Target size={16} />, hint: "Vetted opportunities surfaced to users (scored on readiness, demand, revenue).", ingestTab: "content-inbox" },
  { key: "buyers", label: "Buyer requests", collection: "buyer_requests", icon: <Handshake size={16} />, hint: "Marketplace demand-side records.", ingestTab: "content-inbox" },
  { key: "sellers", label: "Seller listings", collection: "seller_listings", icon: <Handshake size={16} />, hint: "Marketplace supply-side records.", ingestTab: "content-inbox" },
  { key: "risks", label: "Risk alerts", collection: "risk_alerts", icon: <ShieldAlert size={16} />, hint: "Active risk alerts shown on the Executive Overview.", ingestTab: "feed-sources" },
  { key: "reports", label: "Intelligence reports", collection: "reports-ava", icon: <FileText size={16} />, hint: "Published reports listed on /reports.", ingestTab: "content-inbox" },
];

interface Props {
  onNavigate?: (tabId: string) => void;
}

const IntelligenceOverview: React.FC<Props> = ({ onNavigate }) => {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const next: Record<string, number | null> = {};
    await Promise.all(SLOTS.map(async (s) => {
      try {
        const r = await databases.listDocuments(DATABASE_ID, s.collection, [Query.limit(1)]);
        next[s.key] = r.total ?? 0;
      } catch {
        next[s.key] = null;
      }
    }));
    setCounts(next);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const empty = SLOTS.filter((s) => (counts[s.key] ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Intelligence Overview</CardTitle>
              <CardDescription>
                Live view of the collections that power user-facing modules.
                {empty > 0 && <> {empty} collection{empty > 1 ? "s are" : " is"} empty — users will see "no data" until you ingest.</>}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw size={14} className={`mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SLOTS.map((s) => {
          const n = counts[s.key];
          const isErr = n === null;
          const isEmpty = n === 0;
          return (
            <Card key={s.key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">{s.icon} {s.label}</CardTitle>
                  {isErr
                    ? <Badge variant="destructive">missing</Badge>
                    : isEmpty
                      ? <Badge variant="outline" className="border-amber-300 text-amber-700">empty</Badge>
                      : <Badge variant="secondary">{n}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{s.hint}</p>
                <div className="text-xs">
                  Collection: <code className="px-1 py-0.5 rounded bg-muted">{s.collection}</code>
                </div>
                <Button
                  size="sm"
                  variant={isEmpty || isErr ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onNavigate?.(s.ingestTab)}
                >
                  {isErr ? "Configure collection" : isEmpty ? "Open ingestion" : "Manage source"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IntelligenceOverview;
