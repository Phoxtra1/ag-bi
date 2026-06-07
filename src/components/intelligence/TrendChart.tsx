import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  /** "eur" | "number" | "pct" — controls tooltip + Y-axis formatting */
  format?: "eur" | "number" | "pct";
  /** Friendly series label, shown in tooltip */
  seriesLabel?: string;
}

const fmt = (v: number, format: Props["format"]) => {
  if (format === "eur")
    return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  if (format === "pct") return `${v.toFixed(1)}%`;
  return new Intl.NumberFormat("en-IE").format(v);
};

const TrendChart: React.FC<Props> = ({
  data,
  color = "#1D4ED8",
  height = 220,
  format = "number",
  seriesLabel = "Value",
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`tcGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={11}
        tickFormatter={(v) => (format === "eur" ? `€${Math.round(v / 1000)}k` : fmt(v, format))}
        width={55}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 8,
          fontSize: 12,
        }}
        labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 600 }}
        formatter={(v: number) => [fmt(v, format), seriesLabel]}
      />
      <Area type="monotone" dataKey="value" stroke={color} fill={`url(#tcGrad-${color.replace("#", "")})`} strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export default TrendChart;
