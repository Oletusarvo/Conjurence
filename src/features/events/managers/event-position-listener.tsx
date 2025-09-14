'use client';

import { useEventSocket } from '../hooks/use-event-socket';
import { useEventPositionContext } from '../providers/event-position-provider';
import { useEventContext } from '../providers/event-provider';

/**Listens for event position updates.*/
export function EventPositionListener() {
  const { event } = useEventContext();
  const { position: currentPosition, setPosition } = useEventPositionContext();

  useEventSocket({
    eventId: event?.id,
    onPositionUpdate: payload => {
      const { position } = payload;
      if (position.timestamp < currentPosition?.timestamp) return;

      setPosition({
        coordinates: [position.coords.longitude, position.coords.latitude],
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
  });

  return null;
}
