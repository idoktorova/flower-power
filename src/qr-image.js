import { QRCode, QRErrorCorrectLevel } from './qrcode.js';

function encodeQr(value) {
  const qr = new QRCode(0, QRErrorCorrectLevel.L);
  qr.addData(value);
  qr.make();
  return qr;
}

function qrSvgDataUrl(qr) {
  const border = 4;
  const count = qr.getModuleCount();
  const paths = [];
  for (let row = 0; row < count; row++) {
    let start = -1;
    for (let column = 0; column <= count; column++) {
      const dark = column < count && qr.isDark(row, column);
      if (dark && start < 0) start = column;
      if (!dark && start >= 0) {
        paths.push(`M${start + border} ${row + border}h${column - start}v1H${start + border}z`);
        start = -1;
      }
    }
  }
  const size = count + border * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h${size}v${size}H0z"/><path fill="#000" d="${paths.join('')}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createQrDataUrl(candidates) {
  let lastError;
  for (const value of candidates) {
    try {
      return qrSvgDataUrl(encodeQr(value));
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
