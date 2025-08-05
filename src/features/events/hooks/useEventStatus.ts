import { StatusBadgeProps } from '@/components/StatusBadge';
import { useEffect, useMemo, useState } from 'react';

export function useEventStatus(createdAt: any, poll?: boolean) {
  const createdAtTime = useMemo(() => new Date(createdAt).getTime(), [createdAt]);
  const [duration, setDuration] = useState(Date.now() - createdAtTime);

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const timeString = useMemo(() => {
    if (!duration) return 0;
    const roundValue = (val: number) => Math.ceil(val);
    const absTimeLeft = Math.abs(duration);
    if (absTimeLeft >= day) {
      return roundValue(duration / day) + ' days';
    } else if (absTimeLeft >= hour) {
      //One hour
      return roundValue(duration / hour) + ' hours';
    } else if (absTimeLeft >= minute) {
      return roundValue(duration / minute) + ' minutes';
    } else {
      return 'Right now';
    }
  }, [duration]);

  useEffect(() => {
    if (!poll) return;

    const i = setInterval(() => {
      //Update the time the event has been active
      setDuration(Date.now() - createdAtTime);
    }, 1000 * 60);

    return () => {
      clearInterval(i);
    };
  }, [duration, poll, createdAt]);

  return { variant: 'active' as StatusBadgeProps['variant'], timeString };
}
