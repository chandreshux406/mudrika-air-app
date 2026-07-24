import useCountUp from '../hooks/useCountUp';
import CardEmptyState from './CardEmptyState';

const SEGMENTS = [
  { key: 'deep', label: 'Deep', minutes: 102, color: 'var(--color-indigo)' },
  { key: 'light', label: 'Light', minutes: 210, color: 'var(--color-purple)' },
  { key: 'rem', label: 'REM', minutes: 122, color: 'var(--color-cyan)' },
  { key: 'awake', label: 'Awake', minutes: 31, color: 'var(--color-orange)' },
];

const TIME_MARKS = ['10PM', '12AM', '2AM', '4AM'];
const STAT_ORDER = ['deep', 'rem', 'light', 'awake'];

function formatSleepDuration(totalMinutes) {
  const total = Math.round(totalMinutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

export default function SleepCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  const animatedScore = useCountUp(data?.score ?? 0, { duration: 1200, delay: revealDelay });
  const progress = (animatedScore / 100) * circumference;

  const deepMinutes = useCountUp(SEGMENTS[0].minutes, { duration: 1000, delay: revealDelay });
  const remMinutes = useCountUp(SEGMENTS[2].minutes, { duration: 1000, delay: revealDelay + 120 });
  const lightMinutes = useCountUp(SEGMENTS[1].minutes, { duration: 1000, delay: revealDelay + 240 });
  const awakeMinutes = useCountUp(SEGMENTS[3].minutes, { duration: 1000, delay: revealDelay + 360 });

  const animatedMinutes = { deep: deepMinutes, rem: remMinutes, light: lightMinutes, awake: awakeMinutes };

  return (
    <section className="card" style={{ animationDelay: `${revealDelay}ms` }}>
      <span className="card__border-draw" aria-hidden="true" style={{ animationDelay: `${borderDelay}ms` }} />

      <div className="card__header">
        <div>
          <h3 className="card__title">Sleep</h3>
          <p className="card__subtitle">{data ? data.range : 'No sleep data'}</p>
        </div>
        <span className={`pill ${data ? 'pill--purple' : 'pill--muted'}`}>{data ? data.duration : '—'}</span>
      </div>

      {!data ? (
        <CardEmptyState message="No sleep session was recorded on this day." />
      ) : (
        <>
          <div className="sleep-card__body">
            <div className="sleep-card__ring">
              <svg width="54" height="54" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke="var(--color-purple)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress} ${circumference}`}
                  transform="rotate(-90 27 27)"
                />
              </svg>
              <span className="sleep-card__score">{Math.round(animatedScore)}</span>
            </div>

            <div className="sleep-card__chart">
              <div className="sleep-card__bar sleep-card__bar--reveal" style={{ animationDelay: `${revealDelay}ms` }}>
                {SEGMENTS.map((seg) => (
                  <div
                    key={seg.key}
                    className="sleep-card__segment"
                    style={{ flexGrow: seg.minutes, background: seg.color }}
                  >
                    {seg.key !== 'awake' && <span className="sleep-card__segment-label">{seg.label}</span>}
                  </div>
                ))}
              </div>
              <div className="sleep-card__axis">
                {TIME_MARKS.map((mark) => (
                  <span key={mark}>{mark}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="sleep-card__stats">
            {STAT_ORDER.map((key) => {
              const seg = SEGMENTS.find((s) => s.key === key);
              return (
                <div className="stat" key={seg.key}>
                  <span className="stat__value" style={{ color: seg.color }}>
                    {formatSleepDuration(animatedMinutes[key])}
                  </span>
                  <span className="stat__label">{seg.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
