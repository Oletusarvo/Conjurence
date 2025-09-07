'use client';

import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '../providers/event-provider';
import { useEffect } from 'react';
import { useUserContext } from '@/features/users/providers/user-provider';
import { socket } from '@/socket';

/**Emits event-position updates on an event when the position of the host changes. Depends on the User-, Event-, and Geolocation contexts.*/
export function EventPositionUpdater() {
  const { user } = useUserContext();
  const { event } = useEventContext();
  const { position } = useGeolocationContext();

  useEffect(() => {
    //Update the position of mobile events.
    if (!event || event.host !== user.username) return;
    socket.emit('event:position_update', { eventId: event.id, position, user_id: user.id });
  }, [position]);

  return null;
}
