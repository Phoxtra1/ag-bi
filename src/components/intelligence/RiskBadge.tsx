import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { RiskAlert } from "@/types/intelligence";

const toneMap: Record<RiskAlert["severity"], string> = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const RiskBadge: React.FC<{ risk: RiskAlert }> = ({ risk }) => (
  <div className={`flex items-start gap-2 rounded-md border p-3 ${toneMap[risk.severity]}`}>
    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium truncate">{risk.title}</p>
        <Badge variant="outline" className="text-[10px] uppercase">{risk.severity}</Badge>
      </div>
      {risk.summary && <p className="text-xs opacity-80 mt-0.5 line-clamp-2">{risk.summary}</p>}
      <div className="text-[11px] opacity-70 mt-1">
        {risk.category.replace("_", " ")} · score {risk.riskScore}
      </div>
    </div>
  </div>
);

export default RiskBadge;
