const DAY_MS = 86_400_000;

function validDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dateKey(value) {
  const date = value instanceof Date ? value : validDate(value);
  if (!date) return '';
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function buildCareCalendar(purchased, events = [], today = new Date()) {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parsedStart = validDate(purchased);
  const start = parsedStart && parsedStart <= end ? parsedStart : end;
  const eventsByDay = new Map();

  events.forEach(event => {
    const key = dateKey(event?.date);
    if (!key || key < dateKey(start) || key > dateKey(end)) return;
    if (!eventsByDay.has(key)) eventsByDay.set(key, []);
    eventsByDay.get(key).push(event);
  });

  const months = [];
  for (let cursor = new Date(start.getFullYear(), start.getMonth(), 1); cursor <= end; cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)) {
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      const key = dateKey(date);
      days.push({
        day,
        key,
        weekday: (date.getDay() + 6) % 7,
        outsideRange: date < start || date > end,
        events: eventsByDay.get(key) || [],
      });
    }
    months.push({year:cursor.getFullYear(), month:cursor.getMonth(), days});
  }

  return months;
}

export { DAY_MS };
