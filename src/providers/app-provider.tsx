'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useState } from 'react';
import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const [AppContext, useAppContext] = createContextWithUseHook<{
  isInBackground: boolean;
}>('useAppContext can only be called within the scope of an AppContext!');

export function AppProvider({ children }: React.PropsWithChildren) {
  const [isInBackground, setIsInBackground] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const onActive = () => setIsInBackground(false);
    const onPause = () => setIsInBackground(true);

    App.addListener('appStateChange', ({ isActive }) => {
      setIsInBackground(!isActive);
    });

    App.addListener('resume', onActive);
    App.addListener('pause', onPause);

    return () => {
      App.removeAllListeners();
    };
  }, []);

  return <AppContext.Provider value={{ isInBackground }}>{children}</AppContext.Provider>;
}

export { useAppContext };
