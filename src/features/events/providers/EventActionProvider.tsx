'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEventActions } from '../hooks/useEventActions';
import { useEventContext } from './EventProvider';

const [EventActionContext, useEventActionContext] = createContextWithUseHook<
  ReturnType<typeof useEventActions>
>('useEventActionContext can only be used within the scope of an EventActionContext!');

export function EventActionProvider({ children }) {
  const { event } = useEventContext();
  const hook = useEventActions(event.id);

  return <EventActionContext.Provider value={hook}>{children}</EventActionContext.Provider>;
}

export { useEventActionContext };
