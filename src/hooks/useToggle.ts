'use client';

import { useRef, useState } from 'react';

/**Defines logic for toggling a boolean state.
 */
export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState(initialState);

  const toggle = (newState?: boolean) => {
    setState(typeof newState !== 'undefined' ? newState : !state);
  };

  return [state, toggle] as const;
}
