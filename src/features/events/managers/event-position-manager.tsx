'use client';

import { useEventSocket } from '../hooks/use-event-socket';
import { useEventContext } from '../providers/event-provider';

/**Listens for and updates the event position.*/
export function EventPositionManager() {
  const { event, setEvent } = useEventContext();
  useEventSocket({
    eventId: event?.id,
    onPositionUpdate: payload => {
      const { position } = payload;
      setEvent(prev => ({
        ...prev,
        position: {
          coordinates: [position.coords.longitude, position.coords.latitude],
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        },
      }));
    },
  });
  return null;
}
