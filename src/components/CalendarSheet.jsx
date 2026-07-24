import { useMemo, useState } from 'react';
import { getMonthRecords, DAY_STATUS } from '../data/dailyActivity';
import { REFERENCE_TODAY, toISODate } from '../utils/date';

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const STATUS_CLASS = {
  [DAY_STATUS.MET]: 'calendar-day--met',
  [DAY_STATUS.MISSED]: 'calendar-day--missed',
  [DAY_STATUS.NOT_TRACKED]: 'calendar-day--not-tracked',
  [DAY_STATUS.FUTURE]: 'calendar-day--future',
};

export default function CalendarSheet({ sheetRef, dragHandlers, isOpen, selectedDate, onSelectDate }) {
  const initial = selectedDate ? new Date(selectedDate) : REFERENCE_TODAY;
  const [year, setYear] = useState(initial.getFullYear());
  const [monthIndex, setMonthIndex] = useState(initial.getMonth());

  const weeks = useMemo(() => getMonthRecords(year, monthIndex), [year, monthIndex]);
  const todayIso = toISODate(REFERENCE_TODAY);

  const goToPrevMonth = () => {
    if (monthIndex === 0) {
      setYear((y) => y - 1);
      setMonthIndex(11);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (monthIndex === 11) {
      setYear((y) => y + 1);
      setMonthIndex(0);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  return (
    <div className="calendar-sheet" ref={sheetRef} aria-hidden={!isOpen}>
      <div className="calendar-sheet__header">
        <button className="calendar-sheet__nav" onClick={goToPrevMonth} aria-label="Previous month">
          ‹
        </button>
        <span className="calendar-sheet__month">
          {MONTH_LABELS[monthIndex]} {year}
        </span>
        <button className="calendar-sheet__nav" onClick={goToNextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="calendar-sheet__weekdays">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={`${label}-${i}`}>{label}</span>
        ))}
      </div>

      <div className="calendar-sheet__grid">
        {weeks.map((week, weekIndex) => (
          <div className="calendar-sheet__week" key={weekIndex}>
            {week.map((cell) => {
              const status = cell.record?.status;
              const isSelected = cell.iso === selectedDate;
              const isToday = cell.iso === todayIso;
              const isFuture = status === DAY_STATUS.FUTURE;

              return (
                <button
                  key={cell.iso}
                  className={[
                    'calendar-day',
                    STATUS_CLASS[status],
                    !cell.inMonth && 'calendar-day--outside',
                    isSelected && 'calendar-day--selected',
                    isToday && 'calendar-day--today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={isFuture}
                  onClick={() => onSelectDate(cell.iso)}
                >
                  {cell.day}
                  {!isFuture && <span className="calendar-day__dot" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="calendar-sheet__legend">
        <span className="calendar-sheet__legend-item">
          <span className="calendar-sheet__legend-dot calendar-sheet__legend-dot--met" />
          Goal met
        </span>
        <span className="calendar-sheet__legend-item">
          <span className="calendar-sheet__legend-dot calendar-sheet__legend-dot--missed" />
          Goal missed
        </span>
        <span className="calendar-sheet__legend-item">
          <span className="calendar-sheet__legend-dot calendar-sheet__legend-dot--not-tracked" />
          Not tracked
        </span>
      </div>

      <div className="calendar-sheet__drag-zone calendar-sheet__drag-zone--bottom" {...dragHandlers}>
        <span className="calendar-sheet__grabber" aria-hidden="true" />
      </div>
    </div>
  );
}
