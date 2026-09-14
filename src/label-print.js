const LABEL_WIDTH_MM = 45;
const LABEL_HEIGHT_MM = 25;
const QR_SIZE_MM = 21;
// AIYIN exposes 45 × 25 mm stock to browser printing without an orientation
// option. Describe the page in feed direction so the driver does not rotate it.
const PRINT_PAGE_WIDTH_MM = LABEL_HEIGHT_MM;
const PRINT_PAGE_HEIGHT_MM = LABEL_WIDTH_MM;

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function createLabelPrintDocument({ qrUrl, copies = 1 }) {
  const amount = Math.min(50, Math.max(1, Number.parseInt(copies, 10) || 1));
  const labels = Array.from({ length: amount }, () => `<article class="label">
    <img src="${escapeHtml(qrUrl)}" alt="QR">
  </article>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>QR</title><style>
    @page { size: ${PRINT_PAGE_WIDTH_MM}mm ${PRINT_PAGE_HEIGHT_MM}mm; margin: 0; }
    * { box-sizing: border-box; }
    html, body { width: ${PRINT_PAGE_WIDTH_MM}mm; margin: 0; padding: 0; background: #fff; }
    .label { width: ${PRINT_PAGE_WIDTH_MM}mm; height: ${PRINT_PAGE_HEIGHT_MM}mm; display: flex; align-items: center; justify-content: center; page-break-after: always; overflow: hidden; }
    .label:last-child { page-break-after: auto; }
    img { display: block; width: ${QR_SIZE_MM}mm; height: ${QR_SIZE_MM}mm; image-rendering: pixelated; }
  </style></head><body>${labels}</body></html>`;
}
