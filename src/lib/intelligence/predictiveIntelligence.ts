// Lightweight forecasting helpers — used by dashboards before AI engines are wired.

export interface ForecastPoint {
  label: string;
  value: number;
}

export function linearForecast(history: number[], periods = 6): ForecastPoint[] {
  if (history.length === 0) return [];
  const n = history.length;
  const xs = history.map((_, i) => i + 1);
  const ys = history;
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - xMean) * (ys[i] - yMean), 0);
  const den = xs.reduce((s, x) => s + (x - xMean) ** 2, 0) || 1;
  const slope = num / den;
  const intercept = yMean - slope * xMean;

  const out: ForecastPoint[] = [];
  for (let i = 1; i <= periods; i++) {
    const x = n + i;
    out.push({ label: `P${i}`, value: Math.max(0, Math.round(intercept + slope * x)) });
  }
  return out;
}

export function growthRate(history: number[]): number {
  if (history.length < 2) return 0;
  const first = history[0] || 1;
  const last = history[history.length - 1];
  return ((last - first) / Math.abs(first)) * 100;
}
