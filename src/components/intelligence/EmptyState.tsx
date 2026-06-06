import React from "react";
import { Sparkles } from "lucide-react";

const EmptyState: React.FC<{ title: string; description?: string; icon?: React.ReactNode }> = ({
  title,
  description,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 text-muted-foreground">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
      {icon ?? <Sparkles className="text-accent" size={20} />}
    </div>
    <p className="font-medium text-foreground">{title}</p>
    {description && <p className="text-sm mt-1 max-w-md">{description}</p>}
  </div>
);

export default EmptyState;
