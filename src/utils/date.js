export const REFERENCE_TODAY = new Date(2026, 5, 9);

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortLabel(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

export function isSameDay(a, b) {
  return toISODate(a) === toISODate(b);
}

export function getDateStripDays(count = 7) {
  const days = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(REFERENCE_TODAY);
    date.setDate(date.getDate() - i);
    days.push({
      iso: toISODate(date),
      label: i === 0 ? 'Today' : formatShortLabel(date),
    });
  }
  return days;
}

export function getMonthMatrix(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, monthIndex, 1 - startOffset);

  const weeks = [];
  const cursor = new Date(gridStart);
  for (let week = 0; week < 6; week += 1) {
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      days.push({
        iso: toISODate(cursor),
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === monthIndex,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
}
