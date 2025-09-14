'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { TEvent } from '../schemas/event-schema';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useStaleTimestamp } from '@/hooks/use-stale-timestamp';
import { useEventContext } from './event-provider';
import { socket } from '@/socket';
import { useSessionStorage } from '@/hooks/use-session-storage';

const [EventPositionContext, useEventPositionContext] = createContextWithUseHook<{
  position: TEvent['position'];
  positionIsStale: boolean;
  setPosition: React.Dispatch<SetStateAction<TEvent['position']>>;
}>('useEventPositionContext can only be called within the scope of an EventPositionContext!');

type EventPositionProviderProps = React.PropsWithChildren;

export function EventPositionProvider({ children }: EventPositionProviderProps) {
  const { event } = useEventContext();

  const [position, setPosition] = useSessionStorage(
    ['conjurence-event-position', event?.id],
    event?.position,
    true
  );

  //Invalidate positions of mobile events if they haven't been updated for a while.
  const positionIsStale = useStaleTimestamp(
    position?.timestamp,
    45000,
    !!position && event?.is_mobile
  );

  return (
    <EventPositionContext.Provider value={{ position, positionIsStale, setPosition }}>
      {children}
    </EventPositionContext.Provider>
  );
}

export { useEventPositionContext };
