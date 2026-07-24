import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export default function useLiveNumber(
  baseValue,
  { min, max, step = 1, driftIntervalMs = 2200, revealDuration = 1100, revealDelay = 0 } = {},
) {
  const [display, setDisplay] = useState(0);
  const targetRef = useRef(baseValue);

  useEffect(() => {
    targetRef.current = baseValue;
    let cancelled = false;
    let entranceStart = null;
    let rafId = null;

    const liveStep = () => {
      if (cancelled) return;
      setDisplay((d) => d + (targetRef.current - d) * 0.06);
      rafId = requestAnimationFrame(liveStep);
    };

    const revealStep = (ts) => {
      if (cancelled) return;
      if (!entranceStart) entranceStart = ts;
      const progress = Math.min((ts - entranceStart) / revealDuration, 1);
      setDisplay(baseValue * easeOutCubic(progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(revealStep);
      } else {
        rafId = requestAnimationFrame(liveStep);
      }
    };

    const revealTimeout = setTimeout(() => {
      rafId = requestAnimationFrame(revealStep);
    }, revealDelay);

    const driftInterval = setInterval(() => {
      const delta = (Math.random() * 2 - 1) * step;
      let next = targetRef.current + delta;
      if (min != null) next = Math.max(min, next);
      if (max != null) next = Math.min(max, next);
      targetRef.current = next;
    }, driftIntervalMs);

    return () => {
      cancelled = true;
      clearTimeout(revealTimeout);
      clearInterval(driftInterval);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseValue]);

  return display;
}
