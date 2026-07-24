import useCountUp from '../hooks/useCountUp';
import CardEmptyState from './CardEmptyState';

const HOUR_MARKS = ['1H', '2H', '3H', '4H', '5H', '6H'];

export default function HeartRateCard({ data, revealDelay = 0, borderDelay = 0 }) {
  const animatedBpm = useCountUp(data?.bpm ?? 0, { duration: 900, delay: revealDelay });

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
            <svg width="100%" height="53" viewBox="0 0 337 53" fill="none" preserveAspectRatio="none">
              <polyline
                className="chart-line-draw"
                pathLength="1"
                points="0,26 24,26 32,8 40,44 48,20 56,26 96,26 104,10 112,42 120,22 128,26
                    168,26 176,6 184,46 192,18 200,26 240,26 248,12 256,40 264,24 272,26
                    312,26 320,9 328,45 337,26"
                stroke="var(--color-red)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{ animationDelay: `${revealDelay}ms` }}
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
