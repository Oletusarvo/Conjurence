'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { TEvent } from '../schemas/event-schema';
import { SetStateAction, useState } from 'react';
import { useEventSocket } from '../hooks/use-event-socket';
import { useReloadData } from '@/hooks/use-reload-data';
import { useStaleTimestamp } from '@/hooks/use-stale-timestamp';

type EventProviderProps = React.PropsWithChildren & {
  initialEvent: TEvent;
};

const [EventContext, useEventContext] = createContextWithUseHook<{
  event: EventProviderProps['initialEvent'];
  setEvent: React.Dispatch<SetStateAction<TEvent>>;
  hasEnded: boolean;
  interestCount: number;
}>('useEventContext can only be used within the scope of an EventContext!');

const [EventPositionContext, useEventPositionContext] = createContextWithUseHook<{
  position: TEvent['position'];
  positionIsStale: boolean;
  setPosition: React.Dispatch<SetStateAction<TEvent['position']>>;
}>('useEventPositionContext can only be called within the scope of an EventPositionContext!');

export function EventProvider({ children, initialEvent }: EventProviderProps) {
  const [event, setEvent] = useState(initialEvent);
  const [position, setPosition] = useState(initialEvent?.position);

  //Invalidate positions of mobile events after 30 seconds.
  const positionIsStale = useStaleTimestamp(
    position?.timestamp,
    45000,
    !!position && event?.is_mobile
  );

  const hasEnded = event?.ended_at !== null;
  const interestCount = event?.interested_count;
  const reloadEvent = useReloadData<TEvent>(
    `/api/events/${event?.id}`,
    data => {
      setEvent(data);
    },
    300
  );

  useEventSocket({
    eventId: event?.id,
    onEnd: () => reloadEvent(),
    onAttendanceUpdate: () => reloadEvent(),
    onUpdate: () => reloadEvent(),
  });

  return (
    <EventContext.Provider value={{ event, setEvent, hasEnded, interestCount }}>
      <EventPositionContext.Provider value={{ position, positionIsStale, setPosition }}>
        {children}
      </EventPositionContext.Provider>
    </EventContext.Provider>
  );
}

export { useEventContext, useEventPositionContext };
