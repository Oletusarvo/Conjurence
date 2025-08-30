'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useSession } from 'next-auth/react';
import { TUser } from '../schemas/user-schema';
import { useSocketRoom } from '@/hooks/use-socket-room';
import { useEffect, useState } from 'react';

const [UserContext, useUserContext] = createContextWithUseHook<{
  user: TUser;
  sessionStatus: ReturnType<typeof useSession>['status'];
  sessionUpdating: boolean;
  updateSession: (opts: any) => void;
}>('useUserContext can only be called within the scope of a UserContext!');

type UserProviderProps = React.PropsWithChildren & {
  user: TUser;
};

export function UserProvider({ children, user }: UserProviderProps) {
  const { update, status: sessionStatus } = useSession();
  const [newSession, setNewSession] = useState<{ attended_event_id: string | null } | null>(null);
  const [sessionUpdating, setSessionUpdating] = useState(false);

  const updateSession = (opts: any) => {
    setNewSession(opts);
  };

  useSocketRoom([`user:${user.id}`]);

  useEffect(() => {
    if (!newSession) return;
    setSessionUpdating(true);

    if (sessionStatus === 'authenticated') {
      update(newSession).then(res => {
        if (res === null) {
          console.log('Session update failed!');
        } else {
          console.log('Session updated.');
          setNewSession(null);
          setSessionUpdating(false);
        }
      });
    } else {
      console.log('Awaiting session status...');
    }
  }, [newSession, sessionStatus]);

  return (
    <UserContext.Provider
      value={{
        user,
        sessionStatus,
        sessionUpdating,
        updateSession,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export { useUserContext };
