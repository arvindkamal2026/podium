"use client";

interface ExportPI {
  code: string;
  text: string;
  category: string;
  status: string;
}

export function PIExportButton({ items, eventName }: { items: ExportPI[]; eventName: string }) {
  async function handleExport() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`PI Progress — ${eventName}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Exported ${new Date().toLocaleDateString()}`, 14, 28);

    let y = 40;
    doc.setFontSize(9);

    for (const pi of items) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`[${pi.status.toUpperCase()}] ${pi.code} — ${pi.text}`, 14, y);
      y += 6;
    }

    doc.save(`podium-pi-progress-${eventName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
    >
      <span className="material-symbols-outlined text-lg">download</span>
      Export PDF
    </button>
  );
}
