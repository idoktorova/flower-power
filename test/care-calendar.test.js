import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCareCalendar, dateKey } from '../src/care-calendar.js';

test('builds every month from purchase through today and attaches care events', () => {
  const months = buildCareCalendar('2026-01-30', [
    {kind:'water', date:'2026-01-31T22:00:00.000Z'},
    {kind:'feed', date:'2026-03-02T08:00:00.000Z', details:'BioGrow'},
  ], new Date(2026, 2, 5));

  assert.equal(months.length, 3);
  assert.deepEqual(months.map(month => month.month), [0, 1, 2]);
  assert.equal(months[0].days[30].events[0].kind, 'water');
  assert.equal(months[2].days[1].events[0].details, 'BioGrow');
  assert.equal(months[0].days[0].outsideRange, true);
  assert.equal(months[2].days[5].outsideRange, true);
});

test('dateKey keeps the calendar day from an ISO timestamp', () => {
  assert.equal(dateKey('2026-09-18T23:59:00.000Z'), '2026-09-18');
});

test('falls back to the current month when purchase date is missing', () => {
  const months = buildCareCalendar('', [], new Date(2026, 8, 18));
  assert.equal(months.length, 1);
  assert.equal(months[0].month, 8);
});
