'use client';

import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '../providers/event-provider';
import { useEffect } from 'react';
import { useUserContext } from '@/features/users/providers/user-provider';
import { socket } from '@/socket';
import { useEventPositionContext } from '../providers/event-position-provider';

/**Emits event-position updates on an event when the position of the host changes. Depends on the User-, Event-, and Geolocation contexts.*/
export function EventPositionUpdater() {
  const { user } = useUserContext();
  const { event } = useEventContext();
  const { position } = useGeolocationContext();
  const { setPosition } = useEventPositionContext();

  useEffect(() => {
    //Update the position of mobile events.
    if (!event || !position || event.author_id !== user.id) return;
    setPosition(() => {
      const newPosition = {
        coordinates: [position.coords.longitude, position.coords.latitude],
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };
      socket.emit('event:position_update', {
        eventId: event.id,
        position: {
          coords: {
            longitude: newPosition.coordinates.at(0),
            latitude: newPosition.coordinates.at(1),
            accuracy: newPosition.accuracy,
          },
          timestamp: newPosition.timestamp,
        } as GeolocationPosition,
        user_id: user.id,
      });
      return newPosition;
    });
  }, [position?.timestamp]);

  return null;
}
