import useLiveNumber from '../hooks/useLiveNumber';
import CardEmptyState from './CardEmptyState';

const HOUR_MARKS = ['1H', '2H', '3H', '4H', '5H', '6H'];

const PERIOD = 72;
const VISIBLE_WIDTH = 360;
const REPEATS = 10;

function buildEcgPoints() {
  const points = [];
  for (let i = 0; i < REPEATS; i += 1) {
    const x0 = i * PERIOD;
    points.push(`${x0},26`, `${x0 + 8},10`, `${x0 + 16},42`, `${x0 + 24},22`, `${x0 + 32},26`);
  }
  return points.join(' ');
}

const ECG_POINTS = buildEcgPoints();

export default function HeartRateCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const animatedBpm = useLiveNumber(data?.bpm ?? 0, {
    min: 56,
    max: 92,
    step: 2,
    driftIntervalMs: 2000,
    revealDelay,
  });

  return (
    <section className="card" style={{ animationDelay: `${revealDelay}ms` }}>
      <span className="card__border-draw" aria-hidden="true" style={{ animationDelay: `${borderDelay}ms` }} />

      <div className="card__header">
        <div>
          <h3 className="card__title">Heart Rate</h3>
          <p className="card__subtitle">{data ? data.subtitle : 'No heart rate data'}</p>
        </div>
        <span className={`pill ${data ? 'pill--red' : 'pill--muted'}`}>
          {data ? `${Math.round(animatedBpm)} BPM` : '—'}
        </span>
      </div>

      {!data ? (
        <CardEmptyState message="No heart rate readings were recorded on this day." />
      ) : (
        <>
          <div className="heart-card__chart">
            <svg
              className="heart-card__ecg-scroll"
              width={VISIBLE_WIDTH * 2}
              height="53"
              viewBox={`0 0 ${VISIBLE_WIDTH * 2} 53`}
              fill="none"
              preserveAspectRatio="none"
            >
              <polyline
                points={`${ECG_POINTS} ${VISIBLE_WIDTH * 2},26`}
                stroke="var(--color-red)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="heart-card__axis">
            {HOUR_MARKS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
