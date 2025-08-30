'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { TEvent } from '../schemas/event-schema';
import { useEffect, useState } from 'react';
import { useEventSocket } from '../hooks/use-event-socket';
import { useReloadData } from '@/hooks/use-reload-data';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { updateEventAction } from '../actions/update-event-action';
import { socket } from '@/socket';
import { useSocketHandlers } from '@/hooks/use-socket-handlers';
import { useUserContext } from '@/features/users/providers/user-provider';
import { useUpdateMobileEventPosition } from '../hooks/use-update-mobile-event-position';

type EventProviderProps = React.PropsWithChildren & {
  initialEvent: TEvent;
};

const [EventContext, useEventContext] = createContextWithUseHook<{
  event: EventProviderProps['initialEvent'];
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

  useUpdateMobileEventPosition(event);

  useEventSocket({
    eventId: event?.id,
    onEnd: () => reloadEvent(),
    onAttendanceUpdate: () => reloadEvent(),
    onPositionUpdate: payload => {
      const { position } = payload;
      setEvent(prev => ({
        ...prev,
        position: { coordinates: [position.coords.longitude, position.coords.latitude] },
        position_metadata: {
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        },
      }));
    },
  });

  return (
    <EventContext.Provider value={{ event, hasEnded, interestCount }}>
      {children}
    </EventContext.Provider>
  );
}

export { useEventContext };
