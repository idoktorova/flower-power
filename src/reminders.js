const DAY = 86_400_000;

export function calculateWateringReminder(events = [], now = Date.now()) {
  const waterings = events
    .filter(event => event.kind === 'water')
    .map(event => Date.parse(event.date))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .slice(-6);
  if (waterings.length < 2) return null;

  const intervals = waterings.slice(1)
    .map((date, index) => date - waterings[index])
    .filter(interval => interval > 0)
    .sort((a, b) => a - b);
  if (!intervals.length) return null;

  const typicalInterval = Math.max(DAY, intervals[Math.floor(intervals.length / 2)]);
  if (now < waterings.at(-1) + typicalInterval) return null;
  return { days: Math.max(1, Math.round(typicalInterval / DAY)) };
}
