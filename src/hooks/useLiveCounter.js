import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export default function useLiveCounter(
  baseValue,
  { incrementPerTick = 0.01, intervalMs = 1800, revealDuration = 1100, revealDelay = 0 } = {},
) {
  const [display, setDisplay] = useState(0);
  const valueRef = useRef(baseValue);

  useEffect(() => {
    valueRef.current = baseValue;
    let cancelled = false;
    let entranceStart = null;
    let rafId = null;

    const revealStep = (ts) => {
      if (cancelled) return;
      if (!entranceStart) entranceStart = ts;
      const progress = Math.min((ts - entranceStart) / revealDuration, 1);
      setDisplay(baseValue * easeOutCubic(progress));
      if (progress < 1) rafId = requestAnimationFrame(revealStep);
    };

    const revealTimeout = setTimeout(() => {
      rafId = requestAnimationFrame(revealStep);
    }, revealDelay);

    const tickInterval = setInterval(() => {
      valueRef.current += incrementPerTick * (0.6 + Math.random() * 0.8);
      setDisplay(valueRef.current);
    }, intervalMs);

    return () => {
      cancelled = true;
      clearTimeout(revealTimeout);
      clearInterval(tickInterval);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseValue]);

  return display;
}
