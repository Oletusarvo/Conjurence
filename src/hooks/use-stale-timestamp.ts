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
    //Check for stale positions every 30 seconds.
    const t = setInterval(() => {
      setIsStale(isTimestampStale());
    }, 30000);

    return () => {
      clearInterval(t);
    };
  }, [maxAge, isTimestampStale]);

  return isStale;
}
