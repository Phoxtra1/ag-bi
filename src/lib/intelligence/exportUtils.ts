import jsPDF from "jspdf";

export interface ExportSection {
  title: string;
  rows: Array<Record<string, string | number>>;
}

const escapeCSV = (v: string | number) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function sectionToCSV(section: ExportSection): string {
  if (!section.rows.length) return `# ${section.title}\n(no data)\n`;
  const headers = Object.keys(section.rows[0]);
  const lines = [
    `# ${section.title}`,
    headers.join(","),
    ...section.rows.map((r) => headers.map((h) => escapeCSV(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSectionsAsCSV(filenameBase: string, sections: ExportSection[]) {
  const csv = sections.map(sectionToCSV).join("\n\n");
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenameBase}.csv`);
}

export function exportSectionsAsPDF(title: string, filenameBase: string, sections: ExportSection[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()}`, margin, y + 10);
  y += 28;

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableW = pageWidth - margin * 2;

  for (const section of sections) {
    if (y > pageHeight - 80) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.title, margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    if (!section.rows.length) {
      doc.text("(no data)", margin, y);
      y += 18;
      continue;
    }

    const headers = Object.keys(section.rows[0]);
    const colW = usableW / headers.length;
    // Header row
    doc.setFont("helvetica", "bold");
    headers.forEach((h, i) => doc.text(String(h), margin + i * colW, y));
    y += 12;
    doc.setFont("helvetica", "normal");
    // Body
    for (const row of section.rows) {
      if (y > pageHeight - margin) { doc.addPage(); y = margin; }
      headers.forEach((h, i) => {
        const text = String(row[h] ?? "");
        const truncated = text.length > 30 ? text.slice(0, 28) + "…" : text;
        doc.text(truncated, margin + i * colW, y);
      });
      y += 11;
    }
    y += 14;
  }

  doc.save(`${filenameBase}.pdf`);
}
