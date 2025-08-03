'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useRef, useState } from 'react';
import { Header } from './Header';
import { useActionOnClickOutside } from '@/hooks/useActionOnClickOutside';

const [HeaderContext, useHeaderContext] = createContextWithUseHook<{
  ref;
  menuState: {
    showNotifications: boolean;
    showMainMenu: boolean;
  };
  setMenuState;
} | null>();

export function HeaderProvider({ children }) {
  const ref = useRef<HTMLElement>(null);

  const [menuState, setMenuState] = useState({
    showNotifications: false,
    showMainMenu: false,
  });

  useActionOnClickOutside(ref, () =>
    setMenuState({
      showMainMenu: false,
      showNotifications: false,
    })
  );

  return (
    <HeaderContext.Provider value={{ ref, menuState, setMenuState }}>
      <Header ref={ref}>{children}</Header>
    </HeaderContext.Provider>
  );
}

export { useHeaderContext };
