'use client';

import { socket } from '@/socket';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { TUser } from '../schemas/userSchema';

const [UserContext, useUserContext] = createContextWithUseHook<{
  user: TUser;
  sessionStatus: ReturnType<typeof useSession>['status'];
  updateSession: ReturnType<typeof useSession>['update'];
}>('useUserContext can only be called within the scope of a UserContext!');

type UserProviderProps = React.PropsWithChildren & {
  user: TUser;
};

export function UserProvider({ children, user }: UserProviderProps) {
  const { update: updateSession, status: sessionStatus } = useSession();

  const updateJoinedEventId = async (
    eventId: string | null,
    eventType:
      | 'request_placed'
      | 'request_accepted'
      | 'request_rejected'
      | 'request_canceled'
      | 'request_kicked'
  ) => {
    const updateResult = await updateSession({
      joined_event_id: eventId,
    });

    if (updateResult === null) {
      toast.error('Session update failed on ' + eventType);
    }
  };

  useEffect(() => {
    const room = `user:${user.id}`;
    socket.emit('join_room', room);

    socket.on('request_placed', async (eventId: string) => {
      await updateJoinedEventId(eventId, 'request_placed');
      //setMode('accepted');
      toast.success('Request placed!');
    });

    socket.on('request_rejected', async () => {
      await updateJoinedEventId(null, 'request_rejected');
      //setMode('rejected');
    });

    socket.on('request_canceled', async () => {
      await updateJoinedEventId(null, 'request_canceled');
    });

    return () => {
      socket.emit('leave_room', room);
      socket.off('new_notifications');
      socket.off('request_accepted');
      socket.off('request_placed');
      socket.off('request_rejected');
      socket.off('request_kicked');
    };
  }, [user.id]);

  return (
    <UserContext.Provider
      value={{
        user,
        sessionStatus,
        updateSession,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export { useUserContext };
