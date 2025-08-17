'use client';

import { PassProps } from '@/components/PassProps';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEffect, useState } from 'react';
import { useStep } from './StepProvider';

const [TabsContext, useTabsContext] = createContextWithUseHook<{
  currentTab: number;
  setCurrentTab: (tabIndex: number) => void;
}>();

export function TabsProvider({
  children,
  initialTab = 0,
  onChange,
}: React.PropsWithChildren & { onChange?: (tabIndex: number) => void; initialTab?: number }) {
  const { current: currentTab, set: setCurrentTab } = useStep(initialTab);

  useEffect(() => {
    if (!onChange) return;
    onChange(currentTab);
  }, [currentTab]);

  return (
    <TabsContext.Provider value={{ currentTab, setCurrentTab }}>{children}</TabsContext.Provider>
  );
}

TabsProvider.Trigger = function ({
  children,
  tabIndex,
}: React.PropsWithChildren & { tabIndex: number }) {
  const { setCurrentTab, currentTab } = useTabsContext();
  return (
    <PassProps
      onClick={() => setCurrentTab(tabIndex)}
      selected={tabIndex === currentTab}>
      {children}
    </PassProps>
  );
};

TabsProvider.Tab = function ({
  children,
  tabIndex,
}: React.PropsWithChildren & { tabIndex: number }) {
  const { currentTab } = useTabsContext();
  return currentTab === tabIndex ? children : null;
};

export const ProviderTab = TabsProvider.Tab;
export const TabTrigger = TabsProvider.Trigger;
