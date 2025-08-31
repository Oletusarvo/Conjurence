'use client';

import { useSession } from 'next-auth/react';
import { DropDownMenu } from './drop-dow-menu';
import { MenuButton } from '../ui/menu-button';
import { useHeaderContext } from './header-provider';
import { HighlightLink } from '../ui/highlight-link';
import { withIcon } from '@/hoc/with-icon';
import { LogIn, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { Spinner } from '../ui/spinner-temp';
import { ToggleProvider } from '@/providers/toggle-provider';
import { withAlternate } from '@/hoc/with-alternate';

export function MainMenuButton() {
  const { data: session, status } = useSession();
  const { ref, menuState, setMenuState } = useHeaderContext();
  const IconLink = withIcon(({ children, ...props }) => (
    <HighlightLink
      {...props}
      className='text-sm font-semibold'>
      {children}
    </HighlightLink>
  ));

  const getLinks = () => {
    if (status === 'authenticated') {
      return (
        <>
          <span className='text-sm'>@{(session.user as any).username}</span>
          <div className='h-[1px] w-full bg-gray-600 mb-4' />

          <IconLink
            icon={<LogOut />}
            href='/logout'>
            Logout
          </IconLink>
        </>
      );
    } else if (status === 'unauthenticated') {
      return (
        <>
          <IconLink
            icon={<User />}
            href='/register'>
            Register
          </IconLink>
          <IconLink
            icon={<LogIn />}
            href='/login'>
            Login
          </IconLink>
        </>
      );
    } else {
      return <Spinner />;
    }
  };

  const MenuButton = withAlternate(({ children, ...props }) => {
    return (
      <button
        {...props}
        className='--ghost --round'>
        {children}
      </button>
    );
  });

  return (
    <ToggleProvider
      value={menuState.showMainMenu}
      onChange={state =>
        setMenuState({
          showMainMenu: state,
          showNotifications: false,
        })
      }>
      <ToggleProvider.Trigger>
        <MenuButton
          showAlternate={menuState.showMainMenu}
          alternate={<X />}>
          <Menu />
        </MenuButton>
      </ToggleProvider.Trigger>

      <ToggleProvider.Target>
        <DropDownMenu anchor={ref.current?.offsetHeight}>{getLinks()}</DropDownMenu>
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}
