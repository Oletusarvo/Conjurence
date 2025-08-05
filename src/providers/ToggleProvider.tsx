import { PassProps } from '@/components/PassProps';
import { useActionOnClickOutside } from '@/hooks/useActionOnClickOutside';
import { useToggle } from '@/hooks/useToggle';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import React from 'react';
import { useRef, useState } from 'react';

const [ToggleContext, useToggleContext] = createContextWithUseHook<{
  state: boolean;
  toggleState: (newState?: boolean) => void;
  hideOnClickOutside: boolean;
}>('useToggleContext can only be called within the scope of a ToggleContext!');

type ToggleProviderProps = React.PropsWithChildren & {
  value?: boolean;
  onChange?: (state: boolean) => void;
  hideOnClickOutside?: boolean;
};

export function ToggleProvider({
  children,
  value,
  hideOnClickOutside,
  onChange,
}: ToggleProviderProps) {
  const [state, toggle] = useToggle(value);
  const stateToUse = typeof value !== 'undefined' ? value : state;

  const toggleState = (newState?: boolean) => {
    const stateToSet = typeof newState !== 'undefined' ? newState : !stateToUse;

    if (typeof value !== 'undefined' && onChange) {
      onChange(stateToSet);
    } else {
      toggle(stateToSet);
    }
  };

  return (
    <ToggleContext.Provider value={{ state: stateToUse, hideOnClickOutside, toggleState }}>
      {children}
    </ToggleContext.Provider>
  );
}

ToggleProvider.Trigger = function ({ children }: React.PropsWithChildren) {
  const { toggleState } = useToggleContext();
  return <PassProps onClick={() => toggleState()}>{children}</PassProps>;
};

ToggleProvider.Target = function ({ children }: React.PropsWithChildren) {
  const { state, toggleState, hideOnClickOutside } = useToggleContext();
  const targetRef = useRef<HTMLElement>(null);

  if (hideOnClickOutside) {
    useActionOnClickOutside(targetRef, () => toggleState(false));
  }

  if (React.Children.count(children) !== 1) {
    throw new Error('A ToggleProvider.Target must have exactly one child!');
  }

  return state ? <PassProps ref={targetRef}>{children}</PassProps> : null;
};
