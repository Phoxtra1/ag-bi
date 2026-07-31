
# Amniva → Global Intelligence Platform: Phased Build Plan

Scope is large (15+ modules, public pages, workspace, AI assistant, API platform, admin, mobile). I'll deliver in phases that each ship a usable slice, wired to existing Appwrite collections where possible, with new collections added only when a phase needs them. Brand stays intelligence-grade deep blue-black/gold, Inter, € only — per project memory.

## Guiding principles

- Reuse existing Appwrite collections (`predictions`, `reports`, `verifications`, `community`, `contacts`, `newsletters`, `users`, `user_roles`, etc.). Wrap them in new BI-shaped services so UI doesn't depend on raw shapes.
- New "intelligence" data (markets, competitors, opportunities, risks, scores) introduced per phase as new Appwrite collections, with `executeModule` routing kept as the backbone (per `mem://architecture/unified-module-system`).
- Admin Dashboard remains the source of truth for engine routing, scoring weights, and module toggles.
- All scores (Intelligence, Growth, Opportunity, Risk, Confidence) are computed by a single `scoringEngine` service so they stay consistent across pages.
- No mock data in shipped UI. Empty/zero states until real data exists, then progressively wired.

## Phase 0 — Foundations (1 step)

- Add `src/lib/intelligence/` service layer:
  - `marketIntelligence.ts`, `competitorIntelligence.ts`, `opportunityIntelligence.ts`, `riskIntelligence.ts`, `verificationIntelligence.ts`, `predictiveIntelligence.ts`, `scoringEngine.ts`, `reportEngine.ts`.
- Add shared types in `src/types/intelligence.ts` (Score, Opportunity, Competitor, RiskAlert, MarketSignal, IntelligenceReport).
- Add reusable UI primitives in `src/components/intelligence/`:
  - `ScoreCard`, `KPIStat`, `TrendChart`, `OpportunityCard`, `RiskBadge`, `IntelligenceReportCard`, `EmptyState`.
- Extend Appwrite `database.ts` with new collection IDs (created lazily; if a collection is missing the service returns an empty result instead of crashing).

## Phase 1 — Public Platform Reposition

- **Home (`Index.tsx`)** → "Intelligence Operating System" hero, then sections: Trending Markets, Emerging Industries, Investment Opportunities, Business Risk Alerts, Market Forecasts, Featured Reports, Intelligence Highlights. Each section reads from intelligence services; falls back to empty state.
- **New page `Explore.tsx`** (`/explore`) — browse Industries / Markets / Countries / Sectors / Commodities / Opportunities / Trade / Economic intelligence with filters.
- **New page `Reports.tsx`** (`/reports`) — Industry, Market, Country, Investment, Trade, Risk, Opportunity report cards, filter + search.
- **Pricing (`Pricing.tsx`)** → 4 tiers: Starter, Professional, Enterprise, Government & Institutional, with the exact feature bullets from the spec, all € pricing.
- Header/Footer updated with new nav: Home · Explore · Reports · Pricing · About · Login.

## Phase 2 — Executive Workspace & Business Intelligence Module

- Rebuild `UserDashboard.tsx` into an **Executive Dashboard** with tabs:
  1. Executive Overview (5 score cards + market conditions, opportunities, risks, forecasts, competitive landscape)
  2. Business Intelligence
  3. Market Intelligence
  4. Competitor Intelligence
  5. Opportunity Intelligence
  6. Risk Intelligence
  7. Verification
  8. Predictive
  9. Reports
  10. Dipa
  11. Account / API / Support
- **Business Intelligence module**: manual data entry forms (Revenue, Expenses, Sales, Customers, Inventory, Procurement, Suppliers, Employees) + CSV/Excel upload + API/ERP/CRM connector stubs. Generates Revenue analytics, Profitability, Customer intelligence, Growth/Demand/Cash-flow forecasting via `predictiveIntelligence` + recharts.
- KPI dashboards, trend, comparative, benchmarking views all share `ScoreCard`/`TrendChart`.

## Phase 3 — Market + Competitor + Opportunity + Buyer/Seller

- **Market Intelligence**: monitor industries/markets/countries/economic indicators/trade/consumer trends; outlooks + forecasts.
- **Competitor Intelligence**: user-managed watchlist, profiles, scorecards, threat/opportunity alerts.
- **Opportunity Intelligence**: submission flow for Products / Services / Ideas / Projects / Investments / Procurement / Buying / Selling / Import / Export → auto-analysis returning Market demand, Buyer/Supplier intelligence, Geographic & industry opportunities, Revenue projections, Market Readiness + Opportunity scores.
- **Buyer Intelligence**: purchase-requirement form → verified suppliers, pricing, supply availability, risks, rankings, alternatives.
- **Seller Intelligence**: register product/service/inventory → buyer discovery, demand forecasts, pricing recs, export ops + Market Opportunity / Product Competitiveness / Demand Confidence scores.
- **Niche Discovery Engine**: shared service called by Opportunity/Buyer/Seller modules.

## Phase 4 — Verification + Risk + Predictive + Reporting + Investment

- **Verification Intelligence**: extend existing verify flow to cover Businesses, Suppliers, Buyers, Projects, Assets, Documents, Claims → Trust + Credibility scores, risk indicators.
- **Risk Intelligence**: market/industry/financial/supply-chain/regulatory/operational risk scoring, alerts, forecasts, mitigation recs.
- **Predictive Intelligence**: revenue, demand, industry, business performance, investment outcomes, customer behavior, economic-change forecasts with scenario analysis.
- **Investment Intelligence**: evaluator for startups, expansions, acquisitions, real estate, agri, manufacturing, infrastructure → feasibility, viability, projections, risk, attractiveness score, strategic recs.
- **Reporting System**: Daily/Weekly/Monthly/Quarterly/Annual + Opportunity/Risk/Competitor/Market reports, exportable to PDF (jsPDF), Excel/CSV (sheetjs), PowerPoint (pptxgenjs).

## Phase 5 — Dipa as Decision Intelligence Assistant

- Convert `DipaComponent` into a chat-based **conversational intelligence assistant** powered by Lovable AI Gateway (default `google/gemini-3-flash-preview`) through an Appwrite Function that has read access to the user's intelligence context (scores, opportunities, competitors, risks). System prompt frames answers as Insights / Explanations / Recommendations / Forecasts / Strategic guidance.
- Suggested prompt chips for the seven spec questions ("Which market should I enter?" etc.).
- Keep existing 400×500 dialog constraints per `mem://design/dipa-ui-constraints`.

## Phase 6 — API Platform & Admin

- **API Platform page** + workspace tab: Market / Competitor / Opportunity / Verification / Forecasting / AI Intelligence APIs, key management, rate-limit config, usage analytics, billing — all routed through `executeModule`.
- **Admin Dashboard** gains: Organizations, Intelligence Feeds, AI Models, API Usage, Subscriptions, Permissions panels alongside existing tabs.

## Phase 7 — Mobile-optimized views

- Responsive tuning + a dedicated `/m` lightweight executive dashboard, AI assistant, alerts, reports, forecasts, verification — no separate native app, but PWA-friendly.

## Technical section

- **Service shape**: every module exports `list*`, `get*`, `submit*`, `score*` async functions returning typed results. Each catches Appwrite errors and returns `{ data: [], error }` so UIs always render.
- **Scoring**: `scoringEngine.computeScores(context)` returns `{ intelligence, growth, opportunity, risk, marketConfidence }` 0–100, used by Executive Overview and module headers.
- **Collections (created when first phase needs them)**: `markets`, `industries`, `competitors`, `opportunities`, `buyer_requests`, `seller_listings`, `risk_alerts`, `intelligence_reports`, `business_data_entries`, `investment_evaluations`, `api_keys`, `api_usage`. Each with RLS-equivalent Appwrite permissions and `executeModule` routes.
- **AI**: Dipa assistant uses an Appwrite Function calling Lovable AI Gateway. `LOVABLE_API_KEY` stored as Appwrite Function env var (server-only). Function receives the user's intelligence context summary built by `scoringEngine` + recent opportunities/risks.
- **Reports export**: install `jspdf`, `jspdf-autotable`, `xlsx`, `pptxgenjs` in Phase 4.
- **Charts**: reuse `recharts` (already in stack).
- **No Supabase**. Auth bypass on Lovable preview retained per memory.

## Deliverables per phase

I'll ship one phase per follow-up message so you can review each before moving on. Confirm to start with Phase 0 + Phase 1 in the next turn, or tell me to bundle phases differently.
