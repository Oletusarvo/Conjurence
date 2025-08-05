'use client';

import { EventCard } from '@/features/events/components/EventCard';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchProvider } from '../../../providers/SearchProvider';
import Link from 'next/link';
import { TEvent } from '@/features/events/schemas/eventSchema';
import { List } from '../../../components/List';
import { withAlternate } from '@/hoc/withAlternate';
import { EventProvider } from '../providers/EventProvider';

type EventFeedProps = {
  events: TEvent[];
};

/**Renders the main event-feed.
 * @todo Implement infinite scrolling.
 */
export function EventFeed({ events }: EventFeedProps) {
  const { order } = useSearchProvider();
  const EventList = withAlternate(List, true);

  return (
    <EventList
      showAlternate={events.length == 0}
      alternate={<NoEvents />}
      data={events}
      sortFn={(a, b) => {
        const adate = new Date(a.created_at).getTime();
        const bdate = new Date(b.created_at).getTime();
        return order === 'asc' ? adate - bdate : bdate - adate;
      }}
      component={({ item }) => {
        return (
          <EventProvider initialEvent={item}>
            <EventCard />
          </EventProvider>
        );
      }}
    />
  );
}

function NoEvents() {
  return (
    <div className='flex flex-col flex-1 w-full items-center justify-center text-gray-400'>
      <Link
        href='/app/event/create'
        className='flex flex-col items-center gap-2'>
        <PlusCircle size='3rem' />
        <span className='text-center'>
          No Events. <br />
          Tap here to start one!
        </span>
      </Link>
    </div>
  );
}
