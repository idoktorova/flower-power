import assert from 'node:assert/strict';
import test from 'node:test';
import { createLabelPrintDocument } from '../src/label-print.js';

test('sends only a cropped 21 x 21 mm QR square to print', () => {
  const document = createLabelPrintDocument({
    qrUrl: 'data:image/svg+xml,qr',
  });

  assert.match(document, /@page \{ size: 21mm 21mm; margin: 0; \}/);
  assert.match(document, /html, body \{ width: 21mm; height: 21mm;/);
  assert.match(document, /<body><img [^>]+><\/body>/);
  assert.doesNotMatch(document, /<article|<strong>|<span>/);
});

test('escapes the QR URL', () => {
  const document = createLabelPrintDocument({ qrUrl: '&quot;<script>' });

  assert.doesNotMatch(document, /<script>/);
  assert.match(document, /&lt;script&gt;/);
  assert.equal((document.match(/<img /g) || []).length, 1);
});
