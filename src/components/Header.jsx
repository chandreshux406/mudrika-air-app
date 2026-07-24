export default function Header({ onRefresh, onAdd }) {
  return (
    <div className="app-header">
      <span className="app-header__logo">
        MUDRIKA<span className="app-header__logo-accent">AIR</span>
      </span>
      <div className="app-header__actions">
        <button className="icon-btn icon-btn--ghost" onClick={onRefresh} aria-label="Refresh">
          ↻
        </button>
        <button className="icon-btn icon-btn--glow" onClick={onAdd} aria-label="Add">
          +
        </button>
      </div>
    </div>
  );
}
