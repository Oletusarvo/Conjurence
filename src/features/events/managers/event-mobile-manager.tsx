'use client';

import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '../providers/event-provider';
import { useEffect } from 'react';
import { useUserContext } from '@/features/users/providers/user-provider';
import { socket } from '@/socket';

/**Updates the position of mobile events when the position of the host changes. */
export function EventMobileManager() {
  const { user } = useUserContext();
  const { event } = useEventContext();
  const { position } = useGeolocationContext();

  useEffect(() => {
    //Update the position of mobile events.
    if (!event || !event.is_mobile || event.host !== user.username) return;
    socket.emit('event:position_update', { eventId: event.id, position, user_id: user.id });
  }, [position]);

  return null;
}
