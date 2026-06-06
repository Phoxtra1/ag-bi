import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Lock } from "lucide-react";
import type { IntelligenceReport } from "@/types/intelligence";

const IntelligenceReportCard: React.FC<{ report: IntelligenceReport }> = ({ report: r }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <CardTitle className="text-base leading-tight">{r.title}</CardTitle>
        </div>
        {r.premium && (
          <Badge className="bg-amber-500 text-white"><Lock size={10} className="mr-1" />Premium</Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      {r.summary && <p className="text-sm text-muted-foreground line-clamp-3">{r.summary}</p>}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="capitalize">{r.kind}</Badge>
        {r.industry && <Badge variant="outline">{r.industry}</Badge>}
        {r.region && <Badge variant="outline">{r.region}</Badge>}
      </div>
    </CardContent>
  </Card>
);

export default IntelligenceReportCard;
