'use client';

import { useEventSocket } from '../hooks/use-event-socket';
import { useEventPositionContext } from '../providers/event-provider';
import { useEventContext } from '../providers/event-provider';

/**Listens for event position updates.*/
export function EventPositionListener() {
  const { event } = useEventContext();
  const { setPosition } = useEventPositionContext();

  useEventSocket({
    eventId: event?.id,
    onPositionUpdate: payload => {
      const { position } = payload;
      setPosition({
        coordinates: [position.coords.longitude, position.coords.latitude],
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
  });
  return null;
}
