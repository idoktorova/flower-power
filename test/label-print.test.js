import assert from 'node:assert/strict';
import test from 'node:test';
import { createLabelPrintDocument } from '../src/label-print.js';

test('creates exactly sized 45 x 25 mm pages with a centered, cropped QR', () => {
  const document = createLabelPrintDocument({
    qrUrl: 'data:image/svg+xml,qr',
  });

  assert.match(document, /@page \{ size: 45mm 25mm; margin: 0; \}/);
  assert.match(document, /\.label \{ position: relative; width: 45mm; height: 25mm;/);
  assert.match(document, /left: 12mm; top: 2mm;/);
  assert.match(document, /width: 21mm; height: 21mm;/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 1);
  assert.doesNotMatch(document, /<strong>|<span>/);
});

test('escapes the QR URL', () => {
  const document = createLabelPrintDocument({ qrUrl: '&quot;<script>' });

  assert.doesNotMatch(document, /<script>/);
  assert.match(document, /&lt;script&gt;/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 1);
});
