'use client';

import { Bell, X } from 'lucide-react';
import { useClassName } from '@/hooks/useClassName';
import { useHeaderContext } from '../../../components/header/HeaderProvider';
import { withCount } from '@/hoc/withCount';
import { useEffect } from 'react';
import { ToggleProvider } from '@/providers/ToggleProvider';
import { withAlternate } from '@/hoc/withAlternate';
import { useNotificationsContext } from '../providers/NotificationsProvider';

export function NotificationsButton() {
  const { menuState, setMenuState, ref } = useHeaderContext();
  const { notifications } = useNotificationsContext();

  const NotificationsButton = withCount(
    withAlternate(({ children, ...props }) => (
      <button
        {...props}
        className='--no-default'>
        {children}
      </button>
    ))
  );

  return (
    <ToggleProvider
      value={menuState.showNotifications}
      onChange={state =>
        setMenuState({
          showNotifications: state,
          showMainMenu: false,
        })
      }>
      <ToggleProvider.Trigger>
        <NotificationsButton
          alternate={<X />}
          showAlternate={menuState.showNotifications}
          showOnZero={false}
          count={notifications.filter(n => !n.seen_at).length}>
          <Bell />
        </NotificationsButton>
      </ToggleProvider.Trigger>

      <ToggleProvider.Target>
        <Notifications anchor={ref.current?.offsetHeight} />
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}

function Notifications({ anchor, ...props }) {
  const { notifications, markNotificationsAsSeen } = useNotificationsContext();

  const className = useClassName(
    'flex w-full h-full flex-col gap-4 py-2 px-4 absolute left-0 -z-10 bg-background-light'
  );

  useEffect(() => {
    //Mark the notes as seen after the first render.
    markNotificationsAsSeen();
  }, []);

  return (
    <div
      {...props}
      className={className}
      style={{ top: anchor }}>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((n, i) => {
          const { type } = n.data;
          if (type === 'join_request') {
            return (
              <div
                className='flex justify-between items-center p-2 border border-gray-600'
                key={`notification-${i}`}>
                <span>
                  <Badge>@{n.data.username}</Badge> wants to join{' '}
                  <Badge>{n.data.event_title}</Badge>
                </span>
                <div className='flex'>
                  <button className=' --no-default p-2 text-xs'>Accept</button>
                </div>
              </div>
            );
          }
        })
      ) : (
        <span>No notifications</span>
      )}
    </div>
  );
}

const Badge = ({ children }) => (
  <span
    style={{
      backgroundColor: 'hsl(from var(--color-accent) h s l / 0.25)',
    }}
    className='text-sm rounded-sm p-1 border border-accent'>
    {children}
  </span>
);
