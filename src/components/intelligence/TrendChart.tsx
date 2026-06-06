import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

const TrendChart: React.FC<Props> = ({ data, color = "#1D4ED8", height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="tcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
      <Tooltip />
      <Area type="monotone" dataKey="value" stroke={color} fill="url(#tcGrad)" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export default TrendChart;
