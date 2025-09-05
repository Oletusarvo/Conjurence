'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { TEvent } from '../schemas/event-schema';
import { SetStateAction, useState } from 'react';
import { useEventSocket } from '../hooks/use-event-socket';
import { useReloadData } from '@/hooks/use-reload-data';

type EventProviderProps = React.PropsWithChildren & {
  initialEvent: TEvent;
};

const [EventContext, useEventContext] = createContextWithUseHook<{
  event: EventProviderProps['initialEvent'];
  setEvent: React.Dispatch<SetStateAction<TEvent>>;
  hasEnded: boolean;
  interestCount: number;
}>('useEventContext can only be used within the scope of an EventContext!');

export function EventProvider({ children, initialEvent }: EventProviderProps) {
  const [event, setEvent] = useState(initialEvent);
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
      {children}
    </EventContext.Provider>
  );
}

export { useEventContext };
