import useCountUp from '../hooks/useCountUp';
import CardEmptyState from './CardEmptyState';

export default function BloodOxygenCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const animatedValue = useCountUp(data?.value ?? 0, { duration: 1000, delay: revealDelay });

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
            <span className="spo2-card__value">{Math.round(animatedValue)}%</span>
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
              <path
                className="chart-fill-fade"
                d="M0,40 L30,38 L60,30 L90,32 L120,22 L150,24 L180,16 L210,14 L248,6 L248,61 L0,61 Z"
                fill="url(#spo2-fill)"
                style={{ animationDelay: `${revealDelay + 900}ms` }}
              />
              <polyline
                className="chart-line-draw"
                pathLength="1"
                points="0,40 30,38 60,30 90,32 120,22 150,24 180,16 210,14 248,6"
                stroke="var(--color-cyan)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{ animationDelay: `${revealDelay}ms` }}
              />
              <circle
                cx="248"
                cy="6"
                r="3.5"
                fill="var(--color-cyan)"
                className="glow-dot glow-dot--cyan chart-dot-pop chart-dot-pop--end"
                style={{ animationDelay: `${revealDelay + 950}ms` }}
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
