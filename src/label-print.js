const LABEL_WIDTH_MM = 45;
const LABEL_HEIGHT_MM = 25;
const QR_SIZE_MM = 21;
const QR_LEFT_MM = (LABEL_WIDTH_MM - QR_SIZE_MM) / 2;
const QR_TOP_MM = (LABEL_HEIGHT_MM - QR_SIZE_MM) / 2;

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function createLabelPrintDocument({ qrUrl }) {
  const label = `<article class="label">
    <img src="${escapeHtml(qrUrl)}" alt="QR">
  </article>`;

  return `<!doctype html><html><head><meta charset="utf-8"><title>QR</title><style>
    @page { size: ${LABEL_WIDTH_MM}mm ${LABEL_HEIGHT_MM}mm; margin: 0; }
    * { box-sizing: border-box; }
    html, body { width: ${LABEL_WIDTH_MM}mm; margin: 0; padding: 0; background: #fff; }
    .label { position: relative; width: ${LABEL_WIDTH_MM}mm; height: ${LABEL_HEIGHT_MM}mm; margin: 0; padding: 0; overflow: hidden; }
    img { position: absolute; left: ${QR_LEFT_MM}mm; top: ${QR_TOP_MM}mm; display: block; width: ${QR_SIZE_MM}mm; height: ${QR_SIZE_MM}mm; max-width: none; max-height: none; object-fit: contain; image-rendering: pixelated; }
  </style></head><body>${label}</body></html>`;
}
