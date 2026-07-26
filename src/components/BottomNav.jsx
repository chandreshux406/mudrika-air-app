const STROKE_ICONS = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  health: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 18v-4M10 18V9M16 18V4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.5-3.5 5-5 8-5s6.5 1.5 8 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const FILLED_ICONS = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
    </svg>
  ),
  health: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" />
      <rect x="10" y="7" width="4" height="13" rx="1" fill="currentColor" />
      <rect x="16" y="3" width="4" height="17" rx="1" fill="currentColor" />
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  ),
};

const ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'health', label: 'Health' },
  { key: 'activity', label: 'Activity' },
  { key: 'profile', label: 'Profile' },
];

export default function BottomNav({ active, onSelect, onOpenChat }) {
  const leftItems = ITEMS.slice(0, 2);
  const rightItems = ITEMS.slice(2);

  return (
    <nav className="bottom-nav">
      {leftItems.map((item) => (
        <NavItem key={item.key} item={item} active={active === item.key} onSelect={onSelect} />
      ))}

      <button className="bottom-nav__fab" onClick={onOpenChat} aria-label="Open health assistant chat">
        <svg className="bottom-nav__fab-icon" width="42" height="42" viewBox="28 20 140 140" fill="none">
          <path
            d="M122 89.9994H115.696C113.942 89.9994 113.064 89.9994 112.287 90.3455C111.511 90.6914 110.923 91.344 109.749 92.6485L107.005 95.6983C106.041 96.7685 105.559 97.3037 104.949 97.2906C104.338 97.2776 103.88 96.7226 102.964 95.6128L93.5557 84.2085C92.7021 83.1737 92.2752 82.6564 91.696 82.6216C91.1167 82.5868 90.631 83.0493 89.6597 83.9745L85.6506 87.7928C84.5063 88.8824 83.9341 89.4274 83.2189 89.7136C82.5037 89.9994 81.7135 89.9994 80.1333 89.9994H74"
            stroke="white"
            strokeOpacity="0.9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M98 72.6683L96.5589 74.0552C96.936 74.4469 97.4563 74.6683 98 74.6683C98.5437 74.6683 99.064 74.4469 99.4411 74.0552L98 72.6683ZM73.0844 93.7237C73.6682 94.6613 74.9016 94.9483 75.8393 94.3645C76.777 93.7808 77.0639 92.5472 76.4801 91.6096L73.0844 93.7237ZM83.4125 100.058C82.6305 99.2781 81.3642 99.2795 80.5841 100.062C79.804 100.843 79.8055 102.11 80.5875 102.89L83.4125 100.058ZM73.3333 82.3655C73.3333 74.8912 76.6859 70.2535 80.8779 68.659C85.0812 67.0601 90.9368 68.2139 96.5589 74.0552L99.4411 71.2813C93.0637 64.6556 85.5859 62.5885 79.4558 64.9203C73.3143 67.2564 69.3333 73.7009 69.3333 82.3655H73.3333ZM107.34 110C111.32 106.862 116.09 102.656 119.883 97.9568C123.634 93.3099 126.667 87.8904 126.667 82.3654H122.667C122.667 86.5013 120.341 91.0211 116.77 95.4445C113.243 99.8152 108.73 103.81 104.864 106.858L107.34 110ZM126.667 82.3654C126.667 73.7009 122.686 67.2564 116.544 64.9203C110.414 62.5885 102.936 64.6556 96.5589 71.2813L99.4411 74.0552C105.063 68.2139 110.919 67.0601 115.122 68.659C119.314 70.2535 122.667 74.8911 122.667 82.3654H126.667ZM88.6598 109.999C92.0579 112.678 94.4003 114.629 98 114.629V110.629C96.0515 110.629 94.8419 109.78 91.1361 106.858L88.6598 109.999ZM104.864 106.858C101.158 109.78 99.9485 110.629 98 110.629V114.629C101.6 114.629 103.942 112.678 107.34 110L104.864 106.858ZM76.4801 91.6096C74.4908 88.4144 73.3333 85.2832 73.3333 82.3655H69.3333C69.3333 86.312 70.8815 90.1853 73.0844 93.7237L76.4801 91.6096ZM91.1361 106.858C88.6909 104.931 85.9758 102.615 83.4125 100.058L80.5875 102.89C83.2893 105.585 86.1285 108.004 88.6598 109.999L91.1361 106.858Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </button>

      {rightItems.map((item) => (
        <NavItem key={item.key} item={item} active={active === item.key} onSelect={onSelect} />
      ))}
    </nav>
  );
}

function NavItem({ item, active, onSelect }) {
  return (
    <button
      className={`bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`}
      onClick={() => onSelect(item.key)}
    >
      <span className="bottom-nav__icon bottom-nav__icon--stroke">{STROKE_ICONS[item.key]}</span>
      <span className="bottom-nav__icon bottom-nav__icon--filled">{FILLED_ICONS[item.key]}</span>
      <span>{item.label}</span>
    </button>
  );
}
