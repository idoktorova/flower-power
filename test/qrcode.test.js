import assert from 'node:assert/strict';
import test from 'node:test';
import { QRCode, QRErrorCorrectLevel } from '../src/qrcode.js';

test('generates a QR matrix locally without an external image service', () => {
  const qr = new QRCode(0, QRErrorCorrectLevel.L);
  qr.addData(`https://plants.example.com/#plant/example?data=${'a'.repeat(1800)}`);
  qr.make();

  assert.ok(qr.getModuleCount() >= 21);
  assert.equal(typeof qr.isDark(0, 0), 'boolean');
});
