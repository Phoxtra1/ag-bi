import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import KPIStat from "@/components/intelligence/KPIStat";
import TrendChart from "@/components/intelligence/TrendChart";
import EmptyState from "@/components/intelligence/EmptyState";
import {
  listBusinessEntries,
  saveBusinessEntry,
  bulkImportEntries,
  computeKPIs,
  forecastSeries,
  parseCSV,
  type BusinessDataEntry,
} from "@/lib/intelligence/businessIntelligence";
import { getCurrentUser } from "@/lib/auth";
import { Upload, Save, Download, BarChart3, Users, Package, Building2 } from "lucide-react";

const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const FIELDS: { key: keyof Omit<BusinessDataEntry, "id" | "period" | "userId" | "createdAt">; label: string; prefix?: string }[] = [
  { key: "revenue", label: "Revenue", prefix: "€" },
  { key: "expenses", label: "Expenses", prefix: "€" },
  { key: "sales", label: "Sales (units)" },
  { key: "customers", label: "Customers" },
  { key: "inventory", label: "Inventory (units)" },
  { key: "procurement", label: "Procurement", prefix: "€" },
  { key: "suppliers", label: "Suppliers" },
  { key: "employees", label: "Employees" },
];

const todayPeriod = () => new Date().toISOString().slice(0, 7);

const BusinessIntelligenceModule: React.FC = () => {
  const [entries, setEntries] = useState<BusinessDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [form, setForm] = useState({
    period: todayPeriod(),
    revenue: 0,
    expenses: 0,
    sales: 0,
    customers: 0,
    inventory: 0,
    procurement: 0,
    suppliers: 0,
    employees: 0,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = async (uid?: string) => {
    setLoading(true);
    const res = await listBusinessEntries(uid);
    setEntries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser().catch(() => null);
      const uid = u?.$id;
      setUserId(uid);
      await reload(uid);
    })();
  }, []);

  const kpis = useMemo(() => computeKPIs(entries), [entries]);
  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.period.localeCompare(b.period)),
    [entries],
  );
  const revenueSeries = sorted.map((e) => ({ label: e.period, value: e.revenue }));
  const expenseSeries = sorted.map((e) => ({ label: e.period, value: e.expenses }));
  const customerSeries = sorted.map((e) => ({ label: e.period, value: e.customers }));

  const forecast = useMemo(() => {
    const f = forecastSeries(sorted.map((e) => e.revenue), 3);
    const lastIdx = sorted.length;
    return [
      ...revenueSeries,
      ...f.map((v, i) => ({ label: `F+${i + 1}`, value: Math.round(v) })),
    ];
  }, [sorted, revenueSeries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveBusinessEntry({ ...form, userId });
    if (res.error) {
      toast({
        title: "Saved locally",
        description: "Cloud collection not available yet — data cached on this device.",
      });
    } else {
      toast({ title: "Data saved", description: `Period ${form.period} recorded.` });
    }
    await reload(userId);
    setForm({ ...form, revenue: 0, expenses: 0, sales: 0, customers: 0 });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text).map((r) => ({ ...r, userId }));
    if (!rows.length) {
      toast({ title: "No rows found", description: "Check CSV headers.", variant: "destructive" });
      return;
    }
    await bulkImportEntries(rows);
    toast({ title: "Import complete", description: `${rows.length} period(s) imported.` });
    await reload(userId);
    if (fileRef.current) fileRef.current.value = "";
  };

  const downloadTemplate = () => {
    const headers =
      "period,revenue,expenses,sales,customers,inventory,procurement,suppliers,employees";
    const example = `${todayPeriod()},100000,75000,1200,540,300,42000,12,18`;
    const blob = new Blob([headers + "\n" + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amniva-business-data-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} /> Business Intelligence
          </CardTitle>
          <CardDescription>
            Capture revenue, expenses, sales, customers, inventory, procurement, suppliers and workforce data.
            KPIs, trends and forecasts are generated automatically.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIStat label="Total Revenue" value={eur(kpis.totalRevenue)} changePct={kpis.revenueGrowthPct} icon={<Building2 size={16} />} />
        <KPIStat label="Net Profit" value={eur(kpis.netProfit)} changePct={kpis.grossMargin} />
        <KPIStat label="Customers" value={sorted[sorted.length - 1]?.customers ?? 0} changePct={kpis.customerGrowthPct} icon={<Users size={16} />} />
        <KPIStat label="Inventory Turnover" value={kpis.inventoryTurnover.toFixed(2)} icon={<Package size={16} />} />
      </div>

      <Tabs defaultValue="entry">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry">Data Entry</TabsTrigger>
          <TabsTrigger value="import">Import / Connect</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Record a period</CardTitle>
              <CardDescription>Monthly snapshot of business performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-3">
                  <Label htmlFor="period">Period (YYYY-MM)</Label>
                  <Input
                    id="period"
                    type="month"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    required
                  />
                </div>
                {FIELDS.map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>
                      {f.prefix ? `${f.label} (${f.prefix})` : f.label}
                    </Label>
                    <Input
                      id={f.key}
                      type="number"
                      min={0}
                      step="any"
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) || 0 })}
                    />
                  </div>
                ))}
                <div className="col-span-2 md:col-span-3 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Period
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk import</CardTitle>
              <CardDescription>
                Upload a CSV of monthly business data. ERP, CRM and accounting connectors (Xero, QuickBooks, SAP, Odoo)
                will activate as integrations come online.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
              <Button onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download template
              </Button>
              <div className="text-xs text-muted-foreground">
                Headers: period,revenue,expenses,sales,customers,inventory,procurement,suppliers,employees
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 space-y-6">
          {sorted.length === 0 ? (
            <EmptyState
              title="No business data yet"
              description="Add a period or import a CSV to unlock revenue, profitability and customer analytics."
            />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendChart data={revenueSeries} color="#1D4ED8" />
                </CardContent>
              </Card>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendChart data={expenseSeries} color="#B45309" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendChart data={customerSeries} color="#059669" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent periods</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left py-2">Period</th>
                        <th className="text-right">Revenue</th>
                        <th className="text-right">Expenses</th>
                        <th className="text-right">Net</th>
                        <th className="text-right">Customers</th>
                        <th className="text-right">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.slice(-12).reverse().map((e) => (
                        <tr key={e.id} className="border-t">
                          <td className="py-2">{e.period}</td>
                          <td className="text-right">{eur(e.revenue)}</td>
                          <td className="text-right">{eur(e.expenses)}</td>
                          <td className="text-right">{eur(e.revenue - e.expenses)}</td>
                          <td className="text-right">{e.customers}</td>
                          <td className="text-right">{e.sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue forecast (next 3 periods)</CardTitle>
              <CardDescription>
                Linear projection from your recorded history. More sophisticated demand and cash-flow models
                activate once enough periods are available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sorted.length < 2 ? (
                <EmptyState
                  title="Need more data"
                  description="Record at least two periods to project trends."
                />
              ) : (
                <TrendChart data={forecast} color="#0F766E" height={260} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligenceModule;
