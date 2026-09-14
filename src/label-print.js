const QR_SIZE_MM = 21;

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function createLabelPrintDocument({ qrUrl }) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>QR</title><style>
    @page { size: ${QR_SIZE_MM}mm ${QR_SIZE_MM}mm; margin: 0; }
    html, body { width: ${QR_SIZE_MM}mm; height: ${QR_SIZE_MM}mm; margin: 0; padding: 0; overflow: hidden; }
    img { display: block; width: ${QR_SIZE_MM}mm; height: ${QR_SIZE_MM}mm; margin: 0; padding: 0; image-rendering: pixelated; }
  </style></head><body><img src="${escapeHtml(qrUrl)}" alt="QR"></body></html>`;
}
