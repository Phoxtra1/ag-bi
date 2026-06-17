import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Handshake, ShoppingCart, Store } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import ChartCard from "@/components/intelligence/ChartCard";
import TrendChart from "@/components/intelligence/TrendChart";
import { listBuyerRequests, listSellerListings, type BuyerRequest, type SellerListing } from "@/lib/intelligence/buyerSellerIntelligence";
import ExportMenu from "@/components/intelligence/ExportMenu";

const eur = (n?: number) =>
  n === undefined ? "—"
  : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const BuyerSellerIntelligenceModule: React.FC = () => {
  const [buyers, setBuyers] = useState<BuyerRequest[]>([]);
  const [sellers, setSellers] = useState<SellerListing[]>([]);

  useEffect(() => {
    (async () => {
      const [b, s] = await Promise.all([listBuyerRequests(40), listSellerListings(40)]);
      setBuyers(b.data);
      setSellers(s.data);
    })();
  }, []);

  const totalBudget = buyers.reduce((s, b) => s + (b.budgetEur ?? 0), 0);
  const avgBudget = buyers.length ? totalBudget / buyers.length : 0;
  const avgPrice = sellers.length
    ? sellers.reduce((s, x) => s + (x.priceEur ?? 0), 0) / sellers.length : 0;

  const budgetByCountry = useMemo(() => {
    const m = new Map<string, number>();
    buyers.forEach((b) => {
      const k = b.country || "Unknown";
      m.set(k, (m.get(k) ?? 0) + (b.budgetEur ?? 0));
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([label, value]) => ({ label, value }));
  }, [buyers]);

  const listingsByCategory = useMemo(() => {
    const m = new Map<string, number>();
    sellers.forEach((s) => {
      const k = s.category || "Other";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([label, value]) => ({ label, value }));
  }, [sellers]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><Handshake size={18} /> Buyer / Seller Intelligence</CardTitle>
              <CardDescription>
                Discover active buyer requests, seller listings, and match opportunities across regions and industries.
              </CardDescription>
            </div>
            <ExportMenu
              title="Buyer / Seller Intelligence Export"
              filenameBase="abi-buyer-seller-intelligence"
              disabled={buyers.length + sellers.length === 0}
              sections={[
                { title: "KPIs", rows: [{ metric: "Buyer requests", value: buyers.length }, { metric: "Seller listings", value: sellers.length }, { metric: "Avg buyer budget (EUR)", value: Math.round(avgBudget) }, { metric: "Avg seller price (EUR)", value: Math.round(avgPrice) }] },
                { title: "Buyer budget by country", rows: budgetByCountry.map((d) => ({ country: d.label, budget_eur: d.value })) },
                { title: "Seller listings by category", rows: listingsByCategory.map((d) => ({ category: d.label, listings: d.value })) },
                { title: "Buyer requests", rows: buyers.map((b) => ({ buyer: b.buyerName, product: b.product, country: b.country ?? "", quantity: b.quantity ?? "", unit: b.unit ?? "", budget_eur: b.budgetEur ?? "", status: b.status ?? "" })) },
                { title: "Seller listings", rows: sellers.map((s) => ({ seller: s.sellerName, product: s.product, country: s.country ?? "", min_order: s.minOrder ?? "", unit: s.unit ?? "", price_eur: s.priceEur ?? "", category: s.category ?? "", status: s.status ?? "" })) },
              ]}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Buyer requests" value={buyers.length} icon={<ShoppingCart size={16} />}
          hint="Open buyer requests visible to you." />
        <KPIStat label="Seller listings" value={sellers.length} icon={<Store size={16} />}
          hint="Active seller listings available in the marketplace." />
        <KPIStat label="Avg buyer budget" value={eur(avgBudget)}
          hint="Mean declared budget across visible buyer requests (EUR)." />
        <KPIStat label="Avg seller price" value={eur(avgPrice)}
          hint="Mean asking price across visible seller listings (EUR)." />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Buyer budget by country" hint="Total declared buyer budget grouped by country (top 8).">
          {budgetByCountry.length > 0
            ? <TrendChart data={budgetByCountry} color="#1D4ED8" format="eur" seriesLabel="Budget" />
            : <EmptyState title="No buyer data yet" description="Buyer requests with budgets will populate this chart." />}
        </ChartCard>
        <ChartCard title="Seller listings by category" hint="Count of listings grouped by product category (top 8).">
          {listingsByCategory.length > 0
            ? <TrendChart data={listingsByCategory} color="#059669" format="number" seriesLabel="Listings" />
            : <EmptyState title="No seller data yet" description="Categorised listings will appear here." />}
        </ChartCard>
      </div>

      <Tabs defaultValue="buyers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buyers">Buyer Requests</TabsTrigger>
          <TabsTrigger value="sellers">Seller Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="buyers" className="mt-4">
          {buyers.length === 0 ? (
            <EmptyState
              title="No buyer requests yet"
              description="Verified buyer requests are published from the admin Submission Queue. None match your scope right now."
              icon={<ShoppingCart size={20} />}
              tip="Sellers: post a listing so buyers can find you the moment requests open."
              actions={[
                { label: "Post a seller listing", to: "/dashboard?tab=verify" },
                { label: "View Reports", to: "/reports", variant: "outline" },
                { label: "Admin: Submission Queue", to: "/admin?tab=content-inbox", variant: "outline" },
              ]}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buyers.map((b) => (
                <Card key={b.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{b.product}</CardTitle>
                      {b.status && <Badge variant="secondary" className="capitalize">{b.status}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="text-muted-foreground text-xs">
                      {b.buyerName} · {[b.country, b.region].filter(Boolean).join(", ") || "—"}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {b.quantity ? <span>Qty: {b.quantity}{b.unit ? ` ${b.unit}` : ""}</span> : null}
                      <span className="text-emerald-600 font-medium">Budget: {eur(b.budgetEur)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sellers" className="mt-4">
          {sellers.length === 0 ? (
            <EmptyState
              title="No seller listings yet"
              description="Seller listings appear once verified by the admin team. None are live for your scope yet."
              icon={<Store size={20} />}
              tip="Buyers: submit a request so suppliers can be matched to your needs."
              actions={[
                { label: "Submit a buyer request", to: "/dashboard?tab=verify" },
                { label: "Go to Business data", to: "/dashboard?tab=business", variant: "outline" },
                { label: "Admin: Submission Queue", to: "/admin?tab=content-inbox", variant: "outline" },
              ]}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellers.map((s) => (
                <Card key={s.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{s.product}</CardTitle>
                      {s.status && <Badge variant="secondary" className="capitalize">{s.status}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="text-muted-foreground text-xs">
                      {s.sellerName} · {[s.country, s.region].filter(Boolean).join(", ") || "—"}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {s.minOrder ? <span>MOQ: {s.minOrder}{s.unit ? ` ${s.unit}` : ""}</span> : null}
                      <span className="text-emerald-600 font-medium">Price: {eur(s.priceEur)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerSellerIntelligenceModule;
