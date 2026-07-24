import { toISODate, getMonthMatrix, REFERENCE_TODAY } from '../utils/date';

export const DAY_STATUS = {
  MET: 'met',
  MISSED: 'missed',
  NOT_TRACKED: 'not-tracked',
  FUTURE: 'future',
};

const RUNNING_GOAL_KM = 5;

const STATUS_OVERRIDES = {
  '2026-06-03': DAY_STATUS.MET,
  '2026-06-04': DAY_STATUS.MISSED,
  '2026-06-05': DAY_STATUS.NOT_TRACKED,
  '2026-06-06': DAY_STATUS.MET,
  '2026-06-07': DAY_STATUS.MISSED,
  '2026-06-08': DAY_STATUS.NOT_TRACKED,
  '2026-06-09': DAY_STATUS.MET,
};

const TODAY_LITERAL_RECORD = {
  running: {
    time: 'Today · 6:30 AM',
    distanceKm: 5.2,
    paceSeconds: 5 * 60 + 24,
    durationSeconds: 28 * 60 + 6,
    calories: 312,
  },
  sleep: {
    score: 85,
    duration: '7h 45m',
    range: 'Last night · 10:30 PM – 6:15 AM',
  },
  heartRate: {
    bpm: 72,
    subtitle: 'Resting · Last 6 hours',
  },
  bloodOxygen: {
    value: 98,
    status: 'Normal',
    subtitle: 'Continuous monitoring',
  },
};

function hashToUnitFloat(iso) {
  let hash = 0;
  for (let i = 0; i < iso.length; i += 1) {
    hash = (hash * 31 + iso.charCodeAt(i) * 2654435761) % 2147483647;
  }
  return (hash % 10000) / 10000;
}

function formatDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function buildDayRecord(iso, status, hash) {
  if (status === DAY_STATUS.NOT_TRACKED || status === DAY_STATUS.FUTURE) {
    return { running: null, sleep: null, heartRate: null, bloodOxygen: null };
  }

  const isMet = status === DAY_STATUS.MET;
  const distanceKm = isMet ? 5 + hash * 3 : 1 + hash * 3.5;
  const paceSeconds = Math.round(280 + hash * 80);
  const durationSeconds = Math.round(distanceKm * paceSeconds);
  const calories = Math.round(distanceKm * 60);

  const sleepMinutes = Math.round(360 + hash * 120);
  const sleepScore = Math.round(65 + hash * 30);

  const bpm = Math.round(58 + hash * 20);
  const spo2 = Math.round(95 + hash * 4);

  return {
    running: {
      time: 'Today · 6:30 AM',
      distanceKm: Math.round(distanceKm * 10) / 10,
      paceSeconds,
      durationSeconds,
      calories,
    },
    sleep: {
      score: sleepScore,
      duration: formatDuration(sleepMinutes),
      range: 'Last night · 10:30 PM – 6:15 AM',
    },
    heartRate: {
      bpm,
      subtitle: 'Resting · Last 6 hours',
    },
    bloodOxygen: {
      value: spo2,
      status: 'Normal',
      subtitle: 'Continuous monitoring',
    },
  };
}

function resolveStatus(date, iso) {
  if (STATUS_OVERRIDES[iso]) return STATUS_OVERRIDES[iso];
  if (date > REFERENCE_TODAY) return DAY_STATUS.FUTURE;
  const hash = hashToUnitFloat(iso);
  if (hash < 0.15) return DAY_STATUS.NOT_TRACKED;
  if (hash < 0.35) return DAY_STATUS.MISSED;
  return DAY_STATUS.MET;
}

const registry = new Map();

function ensureMonthBuilt(year, monthIndex) {
  const key = `${year}-${monthIndex}`;
  if (registry.has(key)) return;
  registry.set(key, true);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const iso = toISODate(date);
    const status = resolveStatus(date, iso);
    const hash = hashToUnitFloat(iso);
    const data = iso === '2026-06-06' ? TODAY_LITERAL_RECORD : buildDayRecord(iso, status, hash);
    dayRecords.set(iso, { iso, status, goalKm: RUNNING_GOAL_KM, ...data });
  }
}

const dayRecords = new Map();

export function getDayRecord(iso) {
  const [year, month] = iso.split('-').map(Number);
  ensureMonthBuilt(year, month - 1);
  return dayRecords.get(iso);
}

export function getMonthRecords(year, monthIndex) {
  return getMonthMatrix(year, monthIndex).map((week) =>
    week.map((cell) => ({ ...cell, record: getDayRecord(cell.iso) })),
  );
}
