'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useSession } from 'next-auth/react';
import { TUser } from '../schemas/userSchema';
import { useTimeout } from '@/hooks/useTimeout';
import { useSocketRoom } from '@/hooks/useSocketRoom';
import { useEffect, useState } from 'react';

const [UserContext, useUserContext] = createContextWithUseHook<{
  user: TUser;
  sessionStatus: ReturnType<typeof useSession>['status'];
  updateSession: (opts: any) => Promise<void>;
}>('useUserContext can only be called within the scope of a UserContext!');

type UserProviderProps = React.PropsWithChildren & {
  user: TUser;
};

export function UserProvider({ children, user }: UserProviderProps) {
  const { update, status: sessionStatus } = useSession();
  const [newSession, setNewSession] = useState<{ attended_event_id: string | null } | null>(null);
  const { addTimeout } = useTimeout();

  /**Runs a next-auth session update if authenticated. Will retry after 500ms if the status is loading. */
  const updateSession = async (opts: any) => {
    setNewSession(opts);
    /*
    return new Promise<void>(async (resolve, reject) => {
      console.log(sessionStatus);
      if (sessionStatus === 'authenticated') {
        await update(opts);
        resolve();
      } else if (sessionStatus === 'loading') {
        //Try again later.
        addTimeout(
          'update-session-timeout',
          async () => {
            await updateSession(opts);
          },
          700
        );
      } else {
        reject(new Error('Cannot update the session of an unauthenticated user!'));
      }
    });*/
  };

  useSocketRoom([`user:${user.id}`]);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && newSession) {
      update(newSession).then(res => {
        if (res === null) {
          console.log('Session update failed!');
        } else {
          console.log('Session updated.');
          setNewSession(null);
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
        updateSession,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export { useUserContext };
