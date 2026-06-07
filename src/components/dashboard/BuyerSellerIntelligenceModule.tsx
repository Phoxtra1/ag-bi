import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Handshake, ShoppingCart, Store } from "lucide-react";
import EmptyState from "@/components/intelligence/EmptyState";
import KPIStat from "@/components/intelligence/KPIStat";
import { listBuyerRequests, listSellerListings, type BuyerRequest, type SellerListing } from "@/lib/intelligence/buyerSellerIntelligence";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Handshake size={18} /> Buyer / Seller Intelligence</CardTitle>
          <CardDescription>
            Discover active buyer requests, seller listings, and match opportunities across regions and industries.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Buyer requests" value={buyers.length} icon={<ShoppingCart size={16} />} />
        <KPIStat label="Seller listings" value={sellers.length} icon={<Store size={16} />} />
        <KPIStat label="Total buyer budget" value={eur(totalBudget)} />
        <KPIStat label="Active countries" value={new Set([...buyers, ...sellers].map((x: any) => x.country).filter(Boolean)).size} />
      </div>

      <Tabs defaultValue="buyers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buyers">Buyer Requests</TabsTrigger>
          <TabsTrigger value="sellers">Seller Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="buyers" className="mt-4">
          {buyers.length === 0 ? (
            <EmptyState title="No buyer requests yet" description="Verified buyer requests will appear here." icon={<ShoppingCart size={20} />} />
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
            <EmptyState title="No seller listings yet" description="Verified seller listings will appear here." icon={<Store size={20} />} />
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
