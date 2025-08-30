import { useUserContext } from '@/features/users/providers/user-provider';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { socket } from '@/socket';
import { useEffect } from 'react';
import { TEvent } from '../schemas/event-schema';

/**Runs a useEffect emitting an event:position_update socket-event on mobile events, when the current user is the host. */
export function useUpdateMobileEventPosition(event: TEvent) {
  const { user } = useUserContext();
  const { position } = useGeolocationContext();

  useEffect(() => {
    //Update the position of mobile events.
    if (!event || !event.is_mobile || event.host !== user.username) return;
    socket.emit('event:position_update', { eventId: event.id, position, user_id: user.id });
  }, [position]);
}
