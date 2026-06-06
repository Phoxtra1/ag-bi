import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  changePct?: number;
  icon?: React.ReactNode;
  className?: string;
}

const KPIStat: React.FC<Props> = ({ label, value, changePct, icon, className }) => {
  const positive = (changePct ?? 0) >= 0;
  return (
    <Card className={cn("border-border/60", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
        {changePct !== undefined && (
          <div
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-xs font-medium",
              positive ? "text-emerald-600" : "text-red-600",
            )}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {positive ? "+" : ""}
            {changePct.toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPIStat;
