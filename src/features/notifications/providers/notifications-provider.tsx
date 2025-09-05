'use client';

import { useUserContext } from '@/features/users/providers/user-provider';
import { useSocketHandlers } from '@/hooks/use-socket-handlers';
import { useSocketRoom } from '@/hooks/use-socket-room';
import { socket } from '@/socket';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const [NotificationsContext, useNotificationsContext] = createContextWithUseHook<{
  notifications: TODO[];
  markNotificationsAsSeen: () => Promise<void>;
}>('useNotificationsContext can only be called within the scope of a NotificationsContext!');

type NotificationsProviderProps = React.PropsWithChildren & {
  initialNotifications: TODO[];
};

export function NotificationsProvider({
  children,
  initialNotifications,
}: NotificationsProviderProps) {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markNotificationsAsSeen = useCallback(async () => {
    try {
      await axios.patch('/api/users/mark_notifications_as_seen', {
        data: notifications.map(n => n.data.status === 'unseen' && n.id).filter(n => n),
      });
    } catch (err) {
      console.log(err.message);
    }
  }, [axios, JSON.stringify(notifications), setNotifications]);

  useSocketRoom([`notifications:${user.id}`]);
  useSocketHandlers({
    'notifications:new': ({ notif }) => {
      setNotifications([notif, ...notifications]);
    },
  });

  return (
    <NotificationsContext.Provider value={{ notifications, markNotificationsAsSeen }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export { useNotificationsContext };
