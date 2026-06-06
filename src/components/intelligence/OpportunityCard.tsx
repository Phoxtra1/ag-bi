import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Sparkles } from "lucide-react";
import type { Opportunity } from "@/types/intelligence";

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity: o }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="text-base leading-tight">{o.title}</CardTitle>
        <Badge variant="secondary" className="capitalize">{o.category}</Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {o.summary && <p className="text-sm text-muted-foreground line-clamp-2">{o.summary}</p>}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {o.region && (
          <span className="inline-flex items-center gap-1"><MapPin size={12} />{o.region}</span>
        )}
        {o.industry && <span>· {o.industry}</span>}
      </div>
      <div className="flex items-center gap-4 pt-1 text-xs">
        <span className="inline-flex items-center gap-1 text-accent-foreground/80">
          <Sparkles size={12} className="text-amber-500" />
          Opportunity {o.opportunityScore ?? 0}
        </span>
        <span className="text-muted-foreground">Readiness {o.marketReadinessScore ?? 0}</span>
        {o.revenueProjection ? (
          <span className="text-emerald-600 font-medium">€{o.revenueProjection.toLocaleString()}</span>
        ) : null}
      </div>
    </CardContent>
  </Card>
);

export default OpportunityCard;
