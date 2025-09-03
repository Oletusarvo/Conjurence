'use client';

import { useEventContext } from '../../providers/event-provider';

export function EventDescription() {
  const { event } = useEventContext();
  return <p className='tracking-tight leading-[18px]'>{event?.description}</p>;
}
