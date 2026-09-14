import assert from 'node:assert/strict';
import test from 'node:test';
import { createLabelPrintDocument } from '../src/label-print.js';

test('creates one printer page per requested thermal label', () => {
  const document = createLabelPrintDocument({
    qrUrl: 'data:image/svg+xml,qr', plantName: 'Монстера', typeName: 'Ароидные', size: '40x30', copies: 3,
  });

  assert.match(document, /@page \{ size: 40mm 30mm; margin: 0; \}/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 3);
  assert.match(document, /Монстера/);
  assert.match(document, /Ароидные/);
});

test('escapes label text and limits the number of copies', () => {
  const document = createLabelPrintDocument({ qrUrl: 'qr', plantName: '<script>', copies: 100 });

  assert.doesNotMatch(document, /<script>/);
  assert.match(document, /&lt;script&gt;/);
  assert.equal((document.match(/<article class="label">/g) || []).length, 50);
});
