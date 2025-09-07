'use client';

import { useStaleTimestamp } from '@/hooks/use-stale-timestamp';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { SetStateAction, useState } from 'react';
import { TEvent } from '../schemas/event-schema';
import { useEventContext } from './event-provider';

const [EventPositionContext, useEventPositionContext] = createContextWithUseHook<{
  position: TEvent['position'];
  setPosition: React.Dispatch<SetStateAction<TEvent['position']>>;
  positionIsStale: boolean;
}>('useEventPositionContext can only be called within the scope of an EventPositionContext!');

type EventPositionProviderProps = React.PropsWithChildren & {
  initialPosition?: TEvent['position'];
  isMobile?: boolean;
};

export function EventPositionProvider({ children }: EventPositionProviderProps) {
  const { event } = useEventContext();
  const [position, setPosition] = useState(event?.position);
  //Invalidate positions of mobile events after 30 seconds.
  const positionIsStale = useStaleTimestamp(
    position.timestamp,
    30000,
    !!position || event?.is_mobile
  );

  return (
    <EventPositionContext.Provider value={{ position, setPosition, positionIsStale }}>
      {children}
    </EventPositionContext.Provider>
  );
}

export { useEventPositionContext };
