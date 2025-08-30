import { PassProps } from '@/components/feature/pass-props';
import { useActionOnClickOutside } from '@/hooks/use-action-on-click-outside';
import { useToggle } from '@/hooks/use-toggle';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (value === undefined) return;
    toggle(value);
  }, [value]);

  return (
    <ToggleContext.Provider value={{ state: stateToUse, hideOnClickOutside, toggleState }}>
      {children}
    </ToggleContext.Provider>
  );
}

/**Triggers toggling of the internal state by passing an onClick-handler to its child via cloneElement.
 * Make sure custom components define an onClick-prop, and pass it to what they render.
 * Takes an optional action-prop that triggers the toggle after it finishes.
 */
ToggleProvider.Trigger = function ({
  children,
  action,
}: React.PropsWithChildren & { action?: () => Promise<void> }) {
  const { toggleState } = useToggleContext();
  return (
    <PassProps
      onClick={async () => {
        if (action) {
          await action();
        }
        toggleState();
      }}>
      {children}
    </PassProps>
  );
};

type ToggleProviderTargetProps = React.PropsWithChildren & {
  useProps?: boolean;
};

ToggleProvider.Target = function ({ children, useProps = false }: ToggleProviderTargetProps) {
  const { state, toggleState, hideOnClickOutside } = useToggleContext();
  const targetRef = useRef<HTMLElement>(null);

  useActionOnClickOutside(targetRef, () => {
    if (hideOnClickOutside) {
      toggleState(false);
    }
  });

  if (React.Children.count(children) !== 1) {
    throw new Error('A ToggleProvider.Target must have exactly one child!');
  }

  const propsToPass: { ref: any; isToggled?: boolean } = {
    ref: targetRef,
  };

  if (useProps) {
    propsToPass.isToggled = state;
  }

  return useProps || state ? <PassProps {...propsToPass}>{children}</PassProps> : null;
};

export { useToggleContext };
