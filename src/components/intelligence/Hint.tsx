import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  text: string;
  size?: number;
}

const Hint: React.FC<Props> = ({ text, size = 12 }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info size={size} className="inline ml-1 text-muted-foreground cursor-help align-middle" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default Hint;
