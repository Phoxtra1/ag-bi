import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Hint from "./Hint";

interface Props {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<Props> = ({ title, hint, children }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
        {hint && <Hint text={hint} />}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default ChartCard;
