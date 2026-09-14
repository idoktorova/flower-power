import assert from 'node:assert/strict';
import test from 'node:test';
import { createLabelPrintDocument } from '../src/label-print.js';

test('compensates AIYIN feed rotation for a 45 x 25 mm QR-only label', () => {
  const document = createLabelPrintDocument({
    qrUrl: 'data:image/svg+xml,qr', copies: 3,
  });

  assert.match(document, /@page \{ size: 25mm 45mm; margin: 0; \}/);
  assert.match(document, /\.label \{ width: 25mm; height: 45mm;/);
  assert.match(document, /width: 21mm; height: 21mm/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 3);
  assert.doesNotMatch(document, /<strong>|<span>/);
});

test('escapes the QR URL and limits the number of copies', () => {
  const document = createLabelPrintDocument({ qrUrl: '&quot;<script>', copies: 100 });

  assert.doesNotMatch(document, /<script>/);
  assert.match(document, /&lt;script&gt;/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 50);
});
