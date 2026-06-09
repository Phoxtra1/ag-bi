import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Upload, X, Download, FileSpreadsheet } from "lucide-react";
import {
  parseCSVDetailed,
  buildCSVTemplate,
  type BusinessDataEntry,
  type CSVRowError,
} from "@/lib/intelligence/businessIntelligence";

interface Props {
  onConfirm: (rows: Omit<BusinessDataEntry, "id" | "createdAt">[]) => Promise<void> | void;
}

const REQUIRED = [
  "period", "revenue", "expenses", "sales", "customers",
  "inventory", "procurement", "suppliers", "employees",
];

const CSVUploadPreview: React.FC<Props> = ({ onConfirm }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseCSVDetailed> | null>(null);
  const [confirming, setConfirming] = useState(false);

  const headers = useMemo(() => {
    if (!rawText) return [];
    const first = rawText.replace(/^\uFEFF/, "").split(/\r?\n/)[0] ?? "";
    return first.split(",").map((h) => h.trim().toLowerCase());
  }, [rawText]);

  const mapping = useMemo(() => {
    return REQUIRED.map((req) => ({
      required: req,
      detected: headers.find((h) => h === req) ?? null,
    }));
  }, [headers]);

  const missingHeaders = mapping.filter((m) => !m.detected).map((m) => m.required);
  const extraHeaders = headers.filter((h) => h && !REQUIRED.includes(h));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const text = await f.text();
    setRawText(text);
    setParsed(parseCSVDetailed(text));
  };

  const reset = () => {
    setFileName(null);
    setRawText("");
    setParsed(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleConfirm = async () => {
    if (!parsed || parsed.rows.length === 0) return;
    setConfirming(true);
    try {
      await onConfirm(parsed.rows);
      reset();
    } finally {
      setConfirming(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([buildCSVTemplate()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "abi-business-data-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
        <Button onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" /> Choose CSV
        </Button>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" /> Download template
        </Button>
        {fileName && (
          <Badge variant="secondary" className="gap-1">
            <FileSpreadsheet size={12} /> {fileName}
            <button onClick={reset} className="ml-1 text-muted-foreground hover:text-foreground"><X size={12} /></button>
          </Badge>
        )}
      </div>

      {parsed && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">Import preview</CardTitle>
            <CardDescription>
              Review detected currency, column mapping and schema issues before saving.
              Nothing is written until you confirm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-md bg-muted/40 p-3">
                <div className="text-xs uppercase text-muted-foreground">Detected currency</div>
                <div className="font-semibold">
                  {parsed.detectedCurrency ?? "EUR (default)"}
                </div>
              </div>
              <div className="rounded-md bg-muted/40 p-3">
                <div className="text-xs uppercase text-muted-foreground">Unit suffixes</div>
                <div className="font-semibold">k / M / B auto-parsed</div>
              </div>
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs uppercase text-emerald-800">Valid rows</div>
                <div className="font-semibold text-emerald-800">{parsed.rows.length}</div>
              </div>
              <div className={`rounded-md p-3 border ${parsed.errors.length ? "bg-red-50 border-red-200" : "bg-muted/40 border-transparent"}`}>
                <div className={`text-xs uppercase ${parsed.errors.length ? "text-red-800" : "text-muted-foreground"}`}>Errors</div>
                <div className={`font-semibold ${parsed.errors.length ? "text-red-800" : ""}`}>{parsed.errors.length}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Column mapping</div>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-1.5">Required column</th>
                      <th className="text-left px-3 py-1.5">Detected in file</th>
                      <th className="text-left px-3 py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapping.map((m) => (
                      <tr key={m.required} className="border-t">
                        <td className="px-3 py-1.5 font-mono">{m.required}</td>
                        <td className="px-3 py-1.5 font-mono">{m.detected ?? "—"}</td>
                        <td className="px-3 py-1.5">
                          {m.detected ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={12} /> matched</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700"><AlertCircle size={12} /> missing</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {extraHeaders.map((h) => (
                      <tr key={h} className="border-t bg-amber-50">
                        <td className="px-3 py-1.5 text-amber-800">— (ignored)</td>
                        <td className="px-3 py-1.5 font-mono">{h}</td>
                        <td className="px-3 py-1.5 text-amber-800">extra column — skipped</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {missingHeaders.length > 0 && (
                <p className="text-xs text-red-700 mt-2">
                  Missing required columns: <code className="font-mono">{missingHeaders.join(", ")}</code>. Fix and re-upload.
                </p>
              )}
            </div>

            {parsed.rows.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Sample (first 5 rows)</div>
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        {REQUIRED.map((h) => <th key={h} className="text-left px-2 py-1.5 font-mono">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.rows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-t">
                          {REQUIRED.map((h) => (
                            <td key={h} className="px-2 py-1.5 font-mono">{String((r as any)[h] ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {parsed.errors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-red-200 text-red-800 text-sm font-semibold">
                  <AlertCircle size={14} /> {parsed.errors.length} row error(s) — these will be skipped
                </div>
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-red-100/60 text-red-900">
                      <tr>
                        <th className="text-left px-3 py-1.5">Row</th>
                        <th className="text-left px-3 py-1.5">Field</th>
                        <th className="text-left px-3 py-1.5">Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.errors.map((err: CSVRowError, i) => (
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

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={reset}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={confirming || parsed.rows.length === 0 || missingHeaders.length > 0}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {confirming ? "Saving…" : `Confirm import (${parsed.rows.length})`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVUploadPreview;
