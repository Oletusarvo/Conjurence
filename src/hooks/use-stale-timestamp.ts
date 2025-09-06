import { TEvent } from '@/features/events/schemas/event-schema';
import { useEffect, useState } from 'react';

export function useStaleTimestamp(timestamp: number, checkInterval: number, enabled?: boolean) {
  const [isStale, setIsStale] = useState(false);

  const isTimestampStale = () => {
    if (!enabled) return false;
    const now = Date.now();
    //A position 30- or over seconds old is considered stale for mobile events.
    return now - timestamp >= 30000;
  };

  useEffect(() => {
    //Check for stale positions every 30 seconds.
    const t = setInterval(() => {
      setIsStale(isTimestampStale());
    }, 30000);

    return () => {
      clearInterval(t);
    };
  }, [checkInterval, isTimestampStale]);

  return isStale;
}
