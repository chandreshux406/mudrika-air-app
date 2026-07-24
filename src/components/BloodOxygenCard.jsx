import useLiveNumber from '../hooks/useLiveNumber';
import useLiveSeries from '../hooks/useLiveSeries';
import CardEmptyState from './CardEmptyState';

const X_POSITIONS = [0, 30, 60, 90, 120, 150, 180, 210, 248];
const INITIAL_Y = [40, 38, 30, 32, 22, 24, 16, 14, 6];

export default function BloodOxygenCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const animatedValue = useLiveNumber(data?.value ?? 0, {
    min: 94,
    max: 99,
    step: 0.4,
    driftIntervalMs: 2500,
    revealDelay,
  });

  const ySeries = useLiveSeries(INITIAL_Y, { min: 4, max: 44, step: 3, intervalMs: 1400 });
  const linePoints = X_POSITIONS.map((x, i) => `${x},${ySeries[i].toFixed(1)}`).join(' ');
  const lastY = ySeries[ySeries.length - 1];
  const areaPath = `M${X_POSITIONS.map((x, i) => `${x},${ySeries[i].toFixed(1)}`).join(' L')} L248,61 L0,61 Z`;

  return (
    <section className="card" style={{ animationDelay: `${revealDelay}ms` }}>
      <span className="card__border-draw" aria-hidden="true" style={{ animationDelay: `${borderDelay}ms` }} />

      <div className="card__header">
        <div>
          <h3 className="card__title">Blood Oxygen (SpO2)</h3>
          <p className="card__subtitle">{data ? data.subtitle : 'No SpO2 data'}</p>
        </div>
        <span className={`pill ${data ? 'pill--green' : 'pill--muted'}`}>{data ? data.status : '—'}</span>
      </div>

      {!data ? (
        <CardEmptyState message="No blood oxygen readings were recorded on this day." />
      ) : (
        <div className="spo2-card__body">
          <div className="spo2-card__reading">
            <span className="spo2-card__value">{animatedValue.toFixed(0)}%</span>
            <span className="spo2-card__label">Healthy</span>
          </div>

          <div className="spo2-card__chart">
            <div className="spo2-card__axis">
              <span>97%</span>
              <span>95%</span>
              <span>93%</span>
            </div>
            <svg width="100%" height="61" viewBox="0 0 248 61" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spo2-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#spo2-fill)" />
              <polyline
                points={linePoints}
                stroke="var(--color-cyan)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="248" cy={lastY} r="3.5" fill="var(--color-cyan)" className="glow-dot glow-dot--cyan" />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
