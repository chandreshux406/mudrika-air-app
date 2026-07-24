export default function CardEmptyState({ title = 'No activity recorded', message }) {
  return (
    <div className="card__empty">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="card__empty-title">{title}</span>
      {message && <span className="card__empty-message">{message}</span>}
    </div>
  );
}
