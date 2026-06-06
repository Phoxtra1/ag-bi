import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number; // 0-100
  hint?: string;
  tone?: "primary" | "accent" | "success" | "warning" | "destructive";
  className?: string;
}

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  primary: "from-primary to-primary/70 text-primary-foreground",
  accent: "from-accent to-accent/70 text-accent-foreground",
  success: "from-emerald-600 to-emerald-500 text-white",
  warning: "from-amber-500 to-amber-400 text-white",
  destructive: "from-red-600 to-red-500 text-white",
};

const ScoreCard: React.FC<Props> = ({ label, value, hint, tone = "primary", className }) => (
  <Card className={cn("overflow-hidden border-0 shadow-md", className)}>
    <div className={cn("bg-gradient-to-br p-5", toneClasses[tone])}>
      <div className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-2 text-4xl font-bold">{Math.round(value)}</div>
      <div className="text-xs opacity-80">/ 100</div>
    </div>
    {hint && (
      <CardContent className="p-3 text-xs text-muted-foreground">{hint}</CardContent>
    )}
  </Card>
);

export default ScoreCard;
