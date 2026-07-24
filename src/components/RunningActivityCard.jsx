import useLiveNumber from '../hooks/useLiveNumber';
import useLiveCounter from '../hooks/useLiveCounter';
import CardEmptyState from './CardEmptyState';

function formatPace(totalSeconds) {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}'${String(sec).padStart(2, '0')}"/km`;
}

function formatDuration(totalSeconds) {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function RunningActivityCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const distanceValue = useLiveCounter(data?.distanceKm ?? 0, {
    incrementPerTick: 0.012,
    intervalMs: 1800,
    revealDuration: 1100,
    revealDelay,
  });
  const paceValue = useLiveNumber(data?.paceSeconds ?? 0, {
    min: (data?.paceSeconds ?? 0) - 15,
    max: (data?.paceSeconds ?? 0) + 15,
    step: 1.5,
    driftIntervalMs: 2400,
    revealDuration: 1100,
    revealDelay: revealDelay + 120,
  });
  const durationValue = useLiveCounter(data?.durationSeconds ?? 0, {
    incrementPerTick: 3.5,
    intervalMs: 1800,
    revealDuration: 1100,
    revealDelay: revealDelay + 240,
  });
  const caloriesValue = useLiveCounter(data?.calories ?? 0, {
    incrementPerTick: 0.7,
    intervalMs: 1800,
    revealDuration: 1100,
    revealDelay: revealDelay + 360,
  });

  return (
    <section className="card" style={{ animationDelay: `${revealDelay}ms` }}>
      <span className="card__border-draw" aria-hidden="true" style={{ animationDelay: `${borderDelay}ms` }} />

      <div className="card__header">
        <div>
          <h3 className="card__title">Running Activity</h3>
          <p className="card__subtitle">{data ? data.time : 'No run logged'}</p>
        </div>
        <span className={`pill ${data ? 'pill--green' : 'pill--muted'}`}>{data ? 'ACTIVE' : 'RESTING'}</span>
      </div>

      {!data ? (
        <CardEmptyState message="You didn't log a run on this day." />
      ) : (
        <div className="running-card__body">
          <div className="running-card__chart">
            <svg width="86" height="64" viewBox="0 0 86 64" fill="none">
              <polyline
                className="running-card__line"
                points="0,54 14,44 24,48 36,26 48,32 60,12 72,18 86,6"
                pathLength="1"
                stroke="var(--color-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{ animationDelay: `${revealDelay}ms` }}
              />
              <circle
                cx="0"
                cy="54"
                r="4"
                fill="var(--color-green)"
                className="glow-dot glow-dot--green running-card__dot running-card__dot--start"
                style={{ animationDelay: `${revealDelay}ms` }}
              />
              <circle
                cx="86"
                cy="6"
                r="4"
                fill="var(--color-orange)"
                className="glow-dot glow-dot--orange running-card__dot running-card__dot--end"
                style={{ animationDelay: `${revealDelay + 950}ms` }}
              />
            </svg>
          </div>

          <div className="running-card__stats">
            <div className="stat">
              <span className="stat__value stat__value--green">{distanceValue.toFixed(1)} km</span>
              <span className="stat__label">Distance</span>
            </div>
            <div className="stat">
              <span className="stat__value stat__value--cyan">{formatPace(paceValue)}</span>
              <span className="stat__label">Pace</span>
            </div>
            <div className="stat">
              <span className="stat__value">{formatDuration(durationValue)}</span>
              <span className="stat__label">Duration</span>
            </div>
            <div className="stat">
              <span className="stat__value stat__value--orange">{Math.round(caloriesValue)} kcal</span>
              <span className="stat__label">Calories</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
