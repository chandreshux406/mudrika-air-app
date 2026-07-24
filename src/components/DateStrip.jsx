export default function DateStrip({ days, selected, onSelect }) {
  return (
    <div className="date-strip">
      {days.map(({ iso, label }) => {
        const isSelected = iso === selected;
        return (
          <button
            key={iso}
            className={`date-strip__item${isSelected ? ' date-strip__item--selected' : ''}`}
            onClick={() => onSelect(iso)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
