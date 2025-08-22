'use client';

import { useSession } from 'next-auth/react';
import { DropDownMenu } from './DropDownMenu';
import { MenuButton } from '../ui/MenuButton';
import { useHeaderContext } from './HeaderProvider';
import { HighlightLink } from '../ui/HighlightLink';
import { withIcon } from '@/hoc/withIcon';
import { LogIn, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { ToggleProvider } from '@/providers/ToggleProvider';
import { withAlternate } from '@/hoc/withAlternate';

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
        className='--no-default'>
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
