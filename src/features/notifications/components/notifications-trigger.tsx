'use client';

import { Bell, X } from 'lucide-react';
import { useClassName } from '@/hooks/use-class-name';
import { useHeaderContext } from '../../../components/header/header-provider';
import { withCount } from '@/hoc/with-count';
import { useEffect } from 'react';
import { ToggleProvider } from '@/providers/toggle-provider';
import { withAlternate } from '@/hoc/with-alternate';
import { useNotificationsContext } from '../providers/notifications-provider';
import { Modal } from '@/components/modal-temp';

export function NotificationsTrigger() {
  const { menuState, setMenuState, ref } = useHeaderContext();
  const { notifications } = useNotificationsContext();

  const NotificationsButton = withCount(
    withAlternate(({ children, ...props }) => (
      <button
        {...props}
        className='--round --ghost'>
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
        <NotificationsModal />
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}

function NotificationsModal() {
  const { notifications, markNotificationsAsSeen } = useNotificationsContext();

  useEffect(() => {
    //Mark the notes as seen after the first render.
    markNotificationsAsSeen();
  }, []);

  return (
    <Modal
      show={true}
      title='Notifications'
      fullHeight>
      <div className='flex w-full h-full justify-center items-center'>
        <span>Notifications coming soon.</span>
      </div>
    </Modal>
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
