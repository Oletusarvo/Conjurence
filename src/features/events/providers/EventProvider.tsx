'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { TEvent } from '../schemas/eventSchema';
import { useEffect, useState } from 'react';
import { useEventSocket } from '../hooks/useEventSocket';
import { useReloadData } from '@/hooks/useReloadData';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { updateEventAction } from '../actions/updateEventAction';

type EventProviderProps = React.PropsWithChildren & {
  initialEvent: TEvent;
};

const [EventContext, useEventContext] = createContextWithUseHook<{
  event: EventProviderProps['initialEvent'];
  hasEnded: boolean;
  interestCount: number;
}>('useEventContext can only be used within the scope of an EventContext!');

export function EventProvider({ children, initialEvent }: EventProviderProps) {
  const { position } = useGeolocationContext();
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

  useEventSocket({
    eventId: event.id,
    onEnd: () => reloadEvent(),
    onUpdate: payload =>
      setEvent(prev => {
        return {
          ...prev,
          ...payload,
        };
      }),
    onAttendanceUpdate: () => reloadEvent(),
  });

  useEffect(() => {
    //Update the position of mobile events.
    if (!event.is_mobile) return;

    const fd = new FormData();
    fd.append('position', JSON.stringify(position));
    updateEventAction(fd);
  }, [position]);

  return (
    <EventContext.Provider value={{ event, hasEnded, interestCount }}>
      {children}
    </EventContext.Provider>
  );
}

export { useEventContext };
