import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Check, Crown, Landmark, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Plan {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  cta: string;
  ctaTo: string;
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "€0",
    period: "/month",
    description: "Get started with core market monitoring and limited AI assistance.",
    icon: Sparkles,
    features: [
      "Market monitoring",
      "Basic intelligence reports",
      "Limited AI assistance",
      "Community access",
    ],
    cta: "Get started",
    ctaTo: "/signup",
  },
  {
    name: "Professional",
    price: "€49",
    period: "/month",
    description: "Competitor and industry intelligence with forecasting tools.",
    icon: Rocket,
    features: [
      "Everything in Starter",
      "Competitor monitoring",
      "Industry intelligence",
      "Forecasting tools",
      "Advanced reports",
    ],
    cta: "Start Professional",
    ctaTo: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "€299",
    period: "/month",
    description: "Full Business Intelligence with custom dashboards and API access.",
    icon: Crown,
    features: [
      "Everything in Professional",
      "Business Intelligence module",
      "Custom dashboards",
      "API access",
      "AI recommendations",
      "Opportunity intelligence",
    ],
    cta: "Talk to sales",
    ctaTo: "/contact",
  },
  {
    name: "Government & Institutional",
    price: "Custom",
    description: "National dashboards, economic and policy intelligence, strategic forecasting.",
    icon: Landmark,
    features: [
      "National dashboards",
      "Economic intelligence",
      "Policy intelligence",
      "Strategic forecasting",
      "Dedicated success team",
      "White-label options",
    ],
    cta: "Request briefing",
    ctaTo: "/contact",
  },
];

const Pricing: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          Plans for every intelligence need
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          From individual analysts to national institutions, Amniva scales with your decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <Card
              key={p.name}
              className={`relative flex flex-col ${
                p.highlight ? "border-accent shadow-lg ring-1 ring-accent" : ""
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <CardHeader className="pb-3">
                <Icon size={22} className="text-primary mb-2" />
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-foreground">{p.price}</span>
                  {p.period && <span className="text-muted-foreground">{p.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Link to={p.ctaTo} className="w-full">
                  <Button
                    className={`w-full ${
                      p.highlight ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""
                    }`}
                    variant={p.highlight ? "default" : "outline"}
                  >
                    {p.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <p className="text-muted-foreground">
          Need help choosing? <Link to="/contact" className="text-primary font-medium hover:underline">Talk to our team</Link>.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Pricing;
