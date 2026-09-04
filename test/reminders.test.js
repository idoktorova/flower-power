import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWateringReminder } from '../src/reminders.js';

const water = date => ({ kind: 'water', date });

test('requires two watering records to learn an interval', () => {
  assert.equal(calculateWateringReminder([water('2026-08-01T10:00:00Z')], Date.parse('2026-09-01T10:00:00Z')), null);
});

test('shows a reminder after the usual watering interval passes', () => {
  const events = [water('2026-08-01T10:00:00Z'), water('2026-08-05T10:00:00Z'), water('2026-08-09T10:00:00Z')];
  assert.deepEqual(calculateWateringReminder(events, Date.parse('2026-08-13T10:00:00Z')), { days: 4 });
});

test('hides the reminder before the next watering is due', () => {
  const events = [water('2026-08-01T10:00:00Z'), water('2026-08-05T10:00:00Z')];
  assert.equal(calculateWateringReminder(events, Date.parse('2026-08-08T10:00:00Z')), null);
});
