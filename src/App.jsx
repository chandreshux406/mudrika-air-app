import { useState } from 'react';
import BackgroundGlow from './components/BackgroundGlow';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import DateStrip from './components/DateStrip';
import PullHandle from './components/PullHandle';
import CalendarSheet from './components/CalendarSheet';
import RunningActivityCard from './components/RunningActivityCard';
import SleepCard from './components/SleepCard';
import HeartRateCard from './components/HeartRateCard';
import BloodOxygenCard from './components/BloodOxygenCard';
import BottomNav from './components/BottomNav';
import useDragSheet from './hooks/useDragSheet';
import { getDayRecord } from './data/dailyActivity';
import { getDateStripDays } from './utils/date';
import './App.css';

const CARD_STAGGER_MS = 250;
const BORDER_LOOP_SLOT_MS = 3000;

const STRIP_DAYS = getDateStripDays();

function App() {
  const [selectedDate, setSelectedDate] = useState('2026-06-06');
  const [activeNav, setActiveNav] = useState('home');
  const { sheetRef, backdropRef, isOpen: isCalendarOpen, close: closeCalendar, handlers } = useDragSheet();

  const dayRecord = getDayRecord(selectedDate);

  const handleSelectDate = (iso) => {
    setSelectedDate(iso);
    closeCalendar();
  };

  return (
    <div className="phone">
      <BackgroundGlow />

      <div className="phone__content">
        <PullHandle handlers={handlers}>
          <StatusBar />
          <Header onRefresh={() => {}} onAdd={() => {}} />
          <DateStrip days={STRIP_DAYS} selected={selectedDate} onSelect={handleSelectDate} />
        </PullHandle>

        <main className="dashboard">
          <RunningActivityCard
            data={dayRecord.running}
            revealDelay={0 * CARD_STAGGER_MS}
            borderDelay={0 * BORDER_LOOP_SLOT_MS}
          />
          <SleepCard
            data={dayRecord.sleep}
            revealDelay={1 * CARD_STAGGER_MS}
            borderDelay={1 * BORDER_LOOP_SLOT_MS}
          />
          <HeartRateCard
            data={dayRecord.heartRate}
            revealDelay={2 * CARD_STAGGER_MS}
            borderDelay={2 * BORDER_LOOP_SLOT_MS}
          />
          <BloodOxygenCard
            data={dayRecord.bloodOxygen}
            revealDelay={3 * CARD_STAGGER_MS}
            borderDelay={3 * BORDER_LOOP_SLOT_MS}
          />
        </main>
      </div>

      <div
        className={`calendar-backdrop${isCalendarOpen ? ' calendar-backdrop--open' : ''}`}
        ref={backdropRef}
        onClick={closeCalendar}
      />
      <CalendarSheet
        sheetRef={sheetRef}
        dragHandlers={handlers}
        isOpen={isCalendarOpen}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <BottomNav active={activeNav} onSelect={setActiveNav} />
    </div>
  );
}

export default App;
