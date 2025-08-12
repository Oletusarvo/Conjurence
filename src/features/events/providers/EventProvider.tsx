'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { TEvent } from '../schemas/eventSchema';
import { useEffect, useState } from 'react';
import { useEventSocket } from '../hooks/useEventSocket';
import axios from 'axios';
import { useAbortSignal } from '@/hooks/useAbortController';
import { useReloadData } from '@/hooks/useReloadData';
import { useRouter } from 'next/navigation';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { useDistance } from '../../distance/hooks/useDistance';
import { endEventAction } from '../actions/endEventAction';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';

type EventProviderProps = React.PropsWithChildren & {
  initialEvent: TEvent;
};

const [EventContext, useEventContext] = createContextWithUseHook<{
  event: EventProviderProps['initialEvent'];
  end: () => Promise<void>;
  hasEnded: boolean;
  interestCount: number;
}>('useEventContext can only be used within the scope of an EventContext!');

export function EventProvider({ children, initialEvent }: EventProviderProps) {
  const attendance = useUserAttendanceContext();
  const [event, setEvent] = useState(initialEvent);
  const hasEnded = event.ended_at !== null;
  const interestCount = event.interested_count;

  const reloadEvent = useReloadData<TEvent>(
    `/api/events/${event.id}`,
    data => {
      setEvent(data);
    },
    300
  );

  const end = async () => {
    await endEventAction(event.id);
    await attendance.leave(event.id);
  };

  useEventSocket({
    eventId: event.id,
    onEnd: () => reloadEvent(),
    onAttendanceUpdate: () => reloadEvent(),
  });

  return (
    <EventContext.Provider value={{ event, hasEnded, interestCount, end }}>
      {children}
    </EventContext.Provider>
  );
}

export { useEventContext };
