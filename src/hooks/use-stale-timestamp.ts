import { TEvent } from '@/features/events/schemas/event-schema';
import { useEffect, useState } from 'react';

export function useStaleTimestamp(timestamp: number, maxAge: number, enabled?: boolean) {
  const [isStale, setIsStale] = useState(false);

  const isTimestampStale = () => {
    if (!enabled) return false;
    const now = Date.now();
    return now - timestamp >= maxAge;
  };

  useEffect(() => {
    setIsStale(isTimestampStale());
    const t = setTimeout(() => {
      setIsStale(!!enabled);
    }, maxAge);

    return () => {
      clearTimeout(t);
    };
  }, [maxAge, timestamp, enabled, setIsStale, isTimestampStale]);

  return isStale;
}
