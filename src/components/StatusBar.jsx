export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons">
        <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
          <rect x="0" y="9" width="3" height="4" rx="1" fill="#fff" fillOpacity="0.85" />
          <rect x="5" y="6" width="3" height="7" rx="1" fill="#fff" fillOpacity="0.85" />
          <rect x="10" y="3" width="3" height="10" rx="1" fill="#fff" fillOpacity="0.85" />
          <rect x="15" y="0" width="3" height="13" rx="1" fill="#fff" fillOpacity="0.3" />
        </svg>
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path
            d="M9 11.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM5.6 8.2a5 5 0 0 1 6.8 0M2.5 5a9.3 9.3 0 0 1 13 0"
            stroke="#D9DFE2"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <svg width="29" height="13" viewBox="0 0 29 13" fill="none">
          <rect x="0.6" y="0.6" width="24.8" height="11.8" rx="3" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" />
          <rect x="2.5" y="2" width="17" height="9" rx="1.5" fill="#fff" fillOpacity="0.9" />
          <rect x="26" y="4" width="3" height="5" rx="1" fill="#fff" fillOpacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
