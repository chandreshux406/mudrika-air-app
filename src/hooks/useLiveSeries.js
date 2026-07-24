import { useEffect, useState } from 'react';

export default function useLiveSeries(initialSeries, { min, max, step = 3, intervalMs = 1200 } = {}) {
  const [series, setSeries] = useState(initialSeries);

  useEffect(() => {
    setSeries(initialSeries);
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const delta = (Math.random() * 2 - 1) * step;
        let next = last + delta;
        if (min != null) next = Math.max(min, next);
        if (max != null) next = Math.min(max, next);
        return [...prev.slice(1), next];
      });
    }, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSeries]);

  return series;
}
