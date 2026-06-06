// Shared types for Amniva Intelligence Operating System

export type ScoreKey =
  | "intelligence"
  | "growth"
  | "opportunity"
  | "risk"
  | "marketConfidence";

export interface IntelligenceScores {
  intelligence: number;
  growth: number;
  opportunity: number;
  risk: number;
  marketConfidence: number;
}

export interface MarketSignal {
  id: string;
  title: string;
  region?: string;
  sector?: string;
  industry?: string;
  country?: string;
  changePct?: number; // e.g. +12.4
  sentiment?: "bullish" | "bearish" | "neutral";
  updatedAt?: string;
  source?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  category:
    | "product"
    | "service"
    | "idea"
    | "project"
    | "investment"
    | "procurement"
    | "buying"
    | "selling"
    | "import"
    | "export";
  region?: string;
  industry?: string;
  marketReadinessScore?: number;
  opportunityScore?: number;
  revenueProjection?: number;
  summary?: string;
  submittedBy?: string;
  submittedAt?: string;
}

export interface Competitor {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  positioning?: string;
  threatScore?: number;
  watchedBy?: string;
}

export type RiskCategory =
  | "market"
  | "industry"
  | "financial"
  | "supply_chain"
  | "regulatory"
  | "operational";

export interface RiskAlert {
  id: string;
  title: string;
  category: RiskCategory;
  severity: "low" | "medium" | "high" | "critical";
  riskScore: number; // 0-100
  region?: string;
  industry?: string;
  summary?: string;
  raisedAt?: string;
}

export type ReportKind =
  | "industry"
  | "market"
  | "country"
  | "investment"
  | "trade"
  | "risk"
  | "opportunity"
  | "competitor";

export interface IntelligenceReport {
  id: string;
  title: string;
  kind: ReportKind;
  summary?: string;
  region?: string;
  industry?: string;
  publishedAt?: string;
  author?: string;
  premium?: boolean;
}

export interface ServiceResult<T> {
  data: T;
  error?: string;
}
