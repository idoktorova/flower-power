const LABEL_SIZES = {
  '40x30': { width: 40, height: 30 },
  '50x30': { width: 50, height: 30 },
  '50x50': { width: 50, height: 50 },
  '58x40': { width: 58, height: 40 },
};

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function createLabelPrintDocument({ qrUrl, plantName, typeName, size = '50x30', copies = 1 }) {
  const dimensions = LABEL_SIZES[size] || LABEL_SIZES['50x30'];
  const amount = Math.min(50, Math.max(1, Number.parseInt(copies, 10) || 1));
  const labels = Array.from({ length: amount }, () => `<article class="label">
    <img src="${escapeHtml(qrUrl)}" alt="QR">
    <div><strong>${escapeHtml(plantName)}</strong>${typeName ? `<span>${escapeHtml(typeName)}</span>` : ''}</div>
  </article>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(plantName)}</title><style>
    @page { size: ${dimensions.width}mm ${dimensions.height}mm; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; color: #000; background: #fff; font-family: Arial, sans-serif; }
    .label { width: ${dimensions.width}mm; height: ${dimensions.height}mm; padding: 2mm; display: flex; align-items: center; gap: 2mm; page-break-after: always; overflow: hidden; }
    .label:last-child { page-break-after: auto; }
    img { width: ${Math.min(dimensions.height - 4, dimensions.width * .58)}mm; height: ${Math.min(dimensions.height - 4, dimensions.width * .58)}mm; flex: none; image-rendering: pixelated; }
    div { min-width: 0; overflow: hidden; }
    strong, span { display: block; overflow-wrap: anywhere; }
    strong { font-size: 10pt; line-height: 1.05; }
    span { margin-top: 1.5mm; font-size: 7pt; line-height: 1.1; }
  </style></head><body>${labels}</body></html>`;
}
