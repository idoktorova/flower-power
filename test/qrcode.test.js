import assert from 'node:assert/strict';
import test from 'node:test';
import { createQrDataUrl } from '../src/qr-image.js';
import { QRCode, QRErrorCorrectLevel } from '../src/qrcode.js';

test('generates a QR matrix locally without an external image service', () => {
  const qr = new QRCode(0, QRErrorCorrectLevel.L);
  qr.addData(`https://plants.example.com/#plant/example?data=${'a'.repeat(1800)}`);
  qr.make();

  assert.ok(qr.getModuleCount() >= 21);
  assert.equal(typeof qr.isDark(0, 0), 'boolean');
});

test('falls back to a shorter target when plant data exceeds QR capacity', () => {
  const image = createQrDataUrl([
    `https://plants.example.com/#plant/example?data=${'a'.repeat(8000)}`,
    'https://plants.example.com/#plant/example',
  ]);

  assert.match(image, /^data:image\/svg\+xml;charset=utf-8,/);
});
