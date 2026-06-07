import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  parseCSVDetailed,
  buildCSVTemplate,
  type BusinessDataEntry,
  type CSVRowError,
} from "@/lib/intelligence/businessIntelligence";
import { getCurrentUser } from "@/lib/auth";
import {
  Upload, Save, Download, BarChart3, Users, Package, Building2,
  Percent, Briefcase, Info, AlertCircle, CheckCircle2,
} from "lucide-react";

const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const FIELDS: { key: keyof Omit<BusinessDataEntry, "id" | "period" | "userId" | "createdAt">; label: string; prefix?: string; hint: string }[] = [
  { key: "revenue", label: "Revenue", prefix: "€", hint: "Total sales income for the period." },
  { key: "expenses", label: "Expenses", prefix: "€", hint: "All operating expenses (COGS, salaries, overheads)." },
  { key: "sales", label: "Sales (units)", hint: "Number of units sold." },
  { key: "customers", label: "Customers", hint: "Total active customers at period end." },
  { key: "inventory", label: "Inventory (units)", hint: "Units on hand at period end." },
  { key: "procurement", label: "Procurement", prefix: "€", hint: "Spend on raw materials & supplier purchases." },
  { key: "suppliers", label: "Suppliers", hint: "Number of active suppliers." },
  { key: "employees", label: "Employees", hint: "Headcount at period end." },
];

const todayPeriod = () => new Date().toISOString().slice(0, 7);

const Hint: React.FC<{ text: string }> = ({ text }) => (
  <TooltipProvider>
    <UITooltip>
      <TooltipTrigger asChild>
        <Info size={12} className="inline ml-1 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </UITooltip>
  </TooltipProvider>
);

const BusinessIntelligenceModule: React.FC = () => {
  const [entries, setEntries] = useState<BusinessDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [importErrors, setImportErrors] = useState<CSVRowError[]>([]);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [form, setForm] = useState({
    period: todayPeriod(),
    revenue: 0, expenses: 0, sales: 0, customers: 0,
    inventory: 0, procurement: 0, suppliers: 0, employees: 0,
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
  const sorted = useMemo(() => [...entries].sort((a, b) => a.period.localeCompare(b.period)), [entries]);

  const revenueSeries = sorted.map((e) => ({ label: e.period, value: e.revenue }));
  const expenseSeries = sorted.map((e) => ({ label: e.period, value: e.expenses }));
  const profitSeries = sorted.map((e) => ({ label: e.period, value: e.revenue - e.expenses }));
  const marginSeries = sorted.map((e) => ({
    label: e.period,
    value: e.revenue > 0 ? Number((((e.revenue - e.expenses) / e.revenue) * 100).toFixed(1)) : 0,
  }));
  const customerSeries = sorted.map((e) => ({ label: e.period, value: e.customers }));
  const inventorySeries = sorted.map((e) => ({ label: e.period, value: e.inventory }));
  const salesSeries = sorted.map((e) => ({ label: e.period, value: e.sales }));
  const revPerEmpSeries = sorted.map((e) => ({
    label: e.period, value: e.employees > 0 ? Math.round(e.revenue / e.employees) : 0,
  }));

  const forecast = useMemo(() => {
    const f = forecastSeries(sorted.map((e) => e.revenue), 3);
    return [
      ...revenueSeries,
      ...f.map((v, i) => ({ label: `F+${i + 1}`, value: Math.round(v) })),
    ];
  }, [sorted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveBusinessEntry({ ...form, userId });
    toast({
      title: res.error ? "Saved locally" : "Data saved",
      description: res.error
        ? "Cloud collection not available yet — cached on this device."
        : `Period ${form.period} recorded.`,
    });
    await reload(userId);
    setForm({ ...form, revenue: 0, expenses: 0, sales: 0, customers: 0 });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportErrors([]);
    setImportSummary(null);
    const text = await file.text();
    const { rows, errors, detectedCurrency } = parseCSVDetailed(text);
    setImportErrors(errors);
    if (rows.length === 0) {
      setImportSummary(`No valid rows. ${errors.length} error(s) detected.`);
      toast({ title: "Import failed", description: "Fix the errors and try again.", variant: "destructive" });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    await bulkImportEntries(rows.map((r) => ({ ...r, userId })));
    const currencyNote = detectedCurrency && detectedCurrency !== "€" && detectedCurrency !== "EUR"
      ? ` Detected ${detectedCurrency} — converted to EUR.` : "";
    setImportSummary(`Imported ${rows.length} period(s). ${errors.length} row(s) skipped.${currencyNote}`);
    toast({
      title: "Import complete",
      description: `${rows.length} imported · ${errors.length} skipped${currencyNote}`,
    });
    await reload(userId);
    if (fileRef.current) fileRef.current.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob([buildCSVTemplate()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abi-business-data-template.csv";
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
            KPIs, trends and forecasts are generated automatically with clear tooltips on every metric.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIStat label="Total Revenue" value={eur(kpis.totalRevenue)} changePct={kpis.revenueGrowthPct} icon={<Building2 size={16} />} />
        <KPIStat label="Net Profit" value={eur(kpis.netProfit)} changePct={kpis.grossMargin} icon={<Percent size={16} />} />
        <KPIStat label="Operating Margin" value={`${kpis.operatingMargin.toFixed(1)}%`} icon={<Percent size={16} />} />
        <KPIStat label="Customers" value={sorted[sorted.length - 1]?.customers ?? 0} changePct={kpis.customerGrowthPct} icon={<Users size={16} />} />
        <KPIStat label="Inventory Turnover" value={kpis.inventoryTurnover.toFixed(2)} icon={<Package size={16} />} />
        <KPIStat label="Revenue / Employee" value={eur(kpis.revenuePerEmployee)} icon={<Briefcase size={16} />} />
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
              <CardDescription>Monthly snapshot of business performance. All values in EUR (€).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-3">
                  <Label htmlFor="period">Period (YYYY-MM)</Label>
                  <Input id="period" type="month" value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })} required />
                </div>
                {FIELDS.map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>
                      {f.prefix ? `${f.label} (${f.prefix})` : f.label}
                      <Hint text={f.hint} />
                    </Label>
                    <Input id={f.key} type="number" min={0} step="any" value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) || 0 })} />
                  </div>
                ))}
                <div className="col-span-2 md:col-span-3 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" /> Save Period
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk import</CardTitle>
              <CardDescription>
                Upload a CSV with monthly business data. Schema is validated, currency symbols
                (€, $, £, EUR/USD/GBP) and unit suffixes (k, M, B) are auto-parsed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
                <Button onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> Upload CSV
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" /> Download template
                </Button>
              </div>

              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">Required columns</p>
                <p className="text-muted-foreground font-mono">
                  period, revenue, expenses, sales, customers, inventory, procurement, suppliers, employees
                </p>
                <p className="text-muted-foreground">
                  • <strong>period</strong> must be <code>YYYY-MM</code> (e.g. 2026-05)
                  <br />• Numeric fields accept <code>"€1,200"</code>, <code>"USD 4500"</code>, <code>"1.2k"</code>, <code>"3M"</code>
                  <br />• Negative values are rejected
                </p>
              </div>

              {importSummary && (
                <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5" />
                  <span>{importSummary}</span>
                </div>
              )}

              {importErrors.length > 0 && (
                <div className="rounded-md border border-red-200 bg-red-50">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-red-200 text-red-800 text-sm font-semibold">
                    <AlertCircle size={14} /> {importErrors.length} row error(s)
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-red-100/50 text-red-900">
                        <tr>
                          <th className="text-left px-3 py-1.5">Row</th>
                          <th className="text-left px-3 py-1.5">Field</th>
                          <th className="text-left px-3 py-1.5">Issue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importErrors.map((err, i) => (
                          <tr key={i} className="border-t border-red-200/60">
                            <td className="px-3 py-1.5 font-mono">{err.row}</td>
                            <td className="px-3 py-1.5 font-mono">{err.field}</td>
                            <td className="px-3 py-1.5 text-red-800">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 space-y-6">
          {sorted.length === 0 ? (
            <EmptyState
              title="No business data yet"
              description="Add a period or import a CSV to unlock revenue, profitability, customer and ops analytics."
            />
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <ChartCard title="Revenue trend" hint="Total sales income per period.">
                  <TrendChart data={revenueSeries} color="#1D4ED8" format="eur" seriesLabel="Revenue" />
                </ChartCard>
                <ChartCard title="Expense trend" hint="Total operating expenses per period.">
                  <TrendChart data={expenseSeries} color="#B45309" format="eur" seriesLabel="Expenses" />
                </ChartCard>
                <ChartCard title="Net profit" hint="Revenue minus expenses per period.">
                  <TrendChart data={profitSeries} color="#059669" format="eur" seriesLabel="Net profit" />
                </ChartCard>
                <ChartCard title="Operating margin %" hint="(Revenue − Expenses) ÷ Revenue, shown as a percentage.">
                  <TrendChart data={marginSeries} color="#7C3AED" format="pct" seriesLabel="Margin" />
                </ChartCard>
                <ChartCard title="Customers" hint="Active customers at end of each period.">
                  <TrendChart data={customerSeries} color="#0EA5E9" format="number" seriesLabel="Customers" />
                </ChartCard>
                <ChartCard title="Sales (units)" hint="Number of units sold per period.">
                  <TrendChart data={salesSeries} color="#DB2777" format="number" seriesLabel="Units" />
                </ChartCard>
                <ChartCard title="Inventory on hand" hint="Inventory units at end of each period.">
                  <TrendChart data={inventorySeries} color="#475569" format="number" seriesLabel="Units" />
                </ChartCard>
                <ChartCard title="Revenue per employee" hint="Total revenue ÷ headcount — a productivity proxy.">
                  <TrendChart data={revPerEmpSeries} color="#0F766E" format="eur" seriesLabel="€ / employee" />
                </ChartCard>
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
                        <th className="text-right">Margin %</th>
                        <th className="text-right">Customers</th>
                        <th className="text-right">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.slice(-12).reverse().map((e) => {
                        const net = e.revenue - e.expenses;
                        const margin = e.revenue > 0 ? (net / e.revenue) * 100 : 0;
                        return (
                          <tr key={e.id} className="border-t">
                            <td className="py-2">{e.period}</td>
                            <td className="text-right">{eur(e.revenue)}</td>
                            <td className="text-right">{eur(e.expenses)}</td>
                            <td className="text-right">{eur(net)}</td>
                            <td className="text-right">{margin.toFixed(1)}%</td>
                            <td className="text-right">{e.customers}</td>
                            <td className="text-right">{e.sales}</td>
                          </tr>
                        );
                      })}
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
                <EmptyState title="Need more data" description="Record at least two periods to project trends." />
              ) : (
                <TrendChart data={forecast} color="#0F766E" height={260} format="eur" seriesLabel="Revenue" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ChartCard: React.FC<{ title: string; hint: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base flex items-center">
        {title} <Hint text={hint} />
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default BusinessIntelligenceModule;
