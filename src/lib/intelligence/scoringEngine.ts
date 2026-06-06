import type { IntelligenceScores, Opportunity, RiskAlert, MarketSignal } from "@/types/intelligence";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

interface ScoringContext {
  opportunities?: Opportunity[];
  risks?: RiskAlert[];
  marketSignals?: MarketSignal[];
  revenueGrowthPct?: number; // -100..+inf
}

export function computeScores(ctx: ScoringContext): IntelligenceScores {
  const ops = ctx.opportunities ?? [];
  const risks = ctx.risks ?? [];
  const signals = ctx.marketSignals ?? [];

  const opportunity =
    ops.length === 0
      ? 0
      : clamp(
          ops.reduce((sum, o) => sum + (o.opportunityScore ?? 0), 0) / ops.length,
        );

  const risk =
    risks.length === 0
      ? 0
      : clamp(risks.reduce((sum, r) => sum + (r.riskScore ?? 0), 0) / risks.length);

  const bullish = signals.filter((s) => s.sentiment === "bullish").length;
  const bearish = signals.filter((s) => s.sentiment === "bearish").length;
  const total = signals.length || 1;
  const marketConfidence = clamp(50 + ((bullish - bearish) / total) * 50);

  const growth = clamp(50 + (ctx.revenueGrowthPct ?? 0));

  const intelligence = clamp(
    opportunity * 0.3 + growth * 0.25 + marketConfidence * 0.25 + (100 - risk) * 0.2,
  );

  return { intelligence, growth, opportunity, risk, marketConfidence };
}

export const EMPTY_SCORES: IntelligenceScores = {
  intelligence: 0,
  growth: 0,
  opportunity: 0,
  risk: 0,
  marketConfidence: 0,
};
