import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface EmptyStateAction {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
}

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: EmptyStateAction[];
  /** Short tip line shown above buttons, e.g. "Tip: enter business data first." */
  tip?: string;
}

const EmptyState: React.FC<Props> = ({ title, description, icon, actions, tip }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 text-muted-foreground">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
      {icon ?? <Sparkles className="text-accent" size={20} />}
    </div>
    <p className="font-medium text-foreground">{title}</p>
    {description && <p className="text-sm mt-1 max-w-md">{description}</p>}
    {tip && (
      <p className="text-xs mt-2 max-w-md text-accent-foreground/80 bg-accent/40 rounded px-2 py-1">
        {tip}
      </p>
    )}
    {actions && actions.length > 0 && (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {actions.map((a, i) =>
          a.to ? (
            <Button key={i} asChild size="sm" variant={a.variant ?? (i === 0 ? "default" : "outline")}>
              <Link to={a.to}>{a.label}</Link>
            </Button>
          ) : (
            <Button key={i} size="sm" variant={a.variant ?? (i === 0 ? "default" : "outline")} onClick={a.onClick}>
              {a.label}
            </Button>
          ),
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
